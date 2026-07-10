import { createAdminClient } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

const MAX_ITEMS = 50;
const MAX_QUANTITY_PER_ITEM = 100;
const NAME_MAX_LENGTH = 100;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

type RawOrderItem = {
  productId: number;
  quantity: number;
};

function sanitizePhoneForWhatsApp(rawNumber: string | null | undefined): string | null {
  if (!rawNumber) return null;
  const digitsOnly = rawNumber.replace(/\D/g, "");
  return digitsOnly.length >= 8 ? digitsOnly : null;
}

function buildWhatsAppMessage(params: {
  customerName: string;
  orderId: string | number;
  orderItems: { product_name: string; quantity: number; subtotal: number }[];
  totalPrice: number;
}) {
  const { customerName, orderId, orderItems, totalPrice } = params;

  const itemLines = orderItems
    .map((item) => `• ${item.product_name} x${item.quantity} — ₦${item.subtotal.toLocaleString()}`)
    .join("\n");

  const shortOrderId = String(orderId).slice(0, 8);

  return (
    `Hi! I just placed an order (#${shortOrderId}).\n\n` +
    `*Order summary:*\n${itemLines}\n\n` +
    `*Total: ₦${totalPrice.toLocaleString()}*\n\n` +
    `My name: ${customerName}`
  );
}

function getPrimaryImageUrl(
  images: { image_url: string; is_primary: boolean }[] | null | undefined
): string | null {
  if (!images || images.length === 0) return null;
  const primary = images.find((img) => img.is_primary);
  return primary ? primary.image_url : images[0].image_url;
}

// Validates raw input and merges duplicate productIds into a single quantity.
function parseAndValidateItems(rawItems: unknown): { productId: number; quantity: number }[] | null {
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > MAX_ITEMS) {
    return null;
  }

  const merged = new Map<number, number>();

  for (const raw of rawItems) {
    if (typeof raw !== "object" || raw === null) return null;

    const { productId, quantity } = raw as RawOrderItem;

    if (!Number.isInteger(productId) || productId <= 0) return null;
    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > MAX_QUANTITY_PER_ITEM) return null;

    merged.set(productId, (merged.get(productId) ?? 0) + quantity);
  }

  for (const quantity of merged.values()) {
    if (quantity > MAX_QUANTITY_PER_ITEM) return null;
  }

  return Array.from(merged.entries()).map(([productId, quantity]) => ({ productId, quantity }));
}

export async function POST(request: Request) {
  const supabase = createAdminClient();

  let payload: { name?: unknown; number?: unknown; items?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, number, items: rawItems, storeSlug } = payload as { storeSlug?: unknown } & typeof payload;

  if (typeof storeSlug !== "string" || storeSlug.trim().length === 0) {
    return NextResponse.json({ error: "Missing store slug" }, { status: 400 });
  }

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > NAME_MAX_LENGTH) {
    return NextResponse.json({ error: "Invalid customer name" }, { status: 400 });
  }

  if (typeof number !== "string" || !PHONE_REGEX.test(number.trim())) {
    return NextResponse.json({ error: "Invalid customer phone number" }, { status: 400 });
  }

  const items = parseAndValidateItems(rawItems);
  if (!items) {
    return NextResponse.json({ error: "Invalid order items" }, { status: 400 });
  }

  const customerName = name.trim();
  const customerNumber = number.trim();

  try {
    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("id, whatsapp_number")
      .eq("slug", storeSlug.trim())
      .single();

    if (storeError) {
      if (storeError.code === "PGRST116") {
        return NextResponse.json({ error: "Store not found" }, { status: 404 });
      }
      console.error("Store fetch error:", storeError);
      return NextResponse.json({ error: "Failed to validate order" }, { status: 500 });
    }

    const storeId = storeData.id;
    const productIds = items.map((item) => item.productId);

    const { data: products, error: productError } = await supabase
      .from("products")
      .select("*, product_images(image_url, is_primary)")
      .in("id", productIds)
      .eq("store_id", storeId);

    if (productError) {
      console.error("Product fetch error:", productError);
      return NextResponse.json({ error: "Failed to validate order" }, { status: 500 });
    }

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more items do not belong to this store" },
        { status: 400 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalPrice = 0;
    let totalQuantity = 0;

    for (const item of items) {
      const product = productMap.get(item.productId)!;
      totalPrice += product.price * item.quantity;
      totalQuantity += item.quantity;
    }

    const { data: orderData, error: orderInsertError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_number: customerNumber,
        total_items: items.length,
        total_quantity: totalQuantity,
        total_price: totalPrice,
        store_id: storeId,
        status: "pending",
      })
      .select("*")
      .single();

    if (orderInsertError || !orderData) {
      console.error("Order insert error:", orderInsertError);
      return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
    }

    const orderItemsPayload = items.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        order_id: orderData.id,
        product_id: item.productId,
        product_name: product.name,
        product_price: product.price,
        product_image: getPrimaryImageUrl(product.product_images),
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    });

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (orderItemsError) {
      console.error("Order items insert error:", orderItemsError);
      await supabase.from("orders").delete().eq("id", orderData.id);
      return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
    }

    const sanitizedNumber = sanitizePhoneForWhatsApp(storeData?.whatsapp_number);
    let whatsappUrl: string | null = null;

    if (sanitizedNumber) {
      const message = buildWhatsAppMessage({
        customerName,
        orderId: orderData.id,
        orderItems: orderItemsPayload,
        totalPrice,
      });
      whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`;
    }

    return NextResponse.json(
      {
        message: "Order placed successfully",
        orderId: orderData.id,
        whatsappUrl,
        hasWhatsapp: Boolean(whatsappUrl),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error placing order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
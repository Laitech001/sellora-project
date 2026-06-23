import { supabase } from "@/lib/supabase";

type products = {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export async function GET() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      product:products (
        name
      )
    `);

  if (error) {
    console.error(error);
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }

  return Response.json(data);
}

// Formats a phone number for use in a wa.me link. WhatsApp links require 
function sanitizePhoneForWhatsApp(rawNumber: string | null | undefined): string | null {
  if (!rawNumber) return null;

  const digitsOnly = rawNumber.replace(/\D/g, "");
  if (digitsOnly.length < 8) return null;

  return digitsOnly;
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

export async function POST(request: Request) {
  try {
    console.log('Received order POST request');
    const payload = await request.json();
    console.log('Payload:', payload);

    const { name, number, items } = payload;

    // handle missing/incorrect fields;
    if (!name || !number || !items || !Array.isArray(items) || items.length === 0) {
      console.log('Missing required fields:', { name, number, items });
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // get total Items from order items
    const totalItems: number = items.length;

    // get all product ids from order items
    const productIds = items.map((item: { productId: number }) => item.productId);
    console.log('Product IDs:', productIds);

    // validate product ids — note: also pulling product_images here now,
    // since order_items needs an image and products no longer has a
    // single image_url column (images live in product_images).
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('*, product_images(image_url, is_primary)')
      .in('id', productIds);

    if (productError) {
      console.error('Product error:', productError);
      return Response.json(
        { error: 'Invalid product IDs in order' },
        { status: 400 }
      );
    }

    if (products.length !== productIds.length) {
      console.log('Some products not found');
      return Response.json(
        { error: 'Some products not found' },
        { status: 400 }
      );
    }
    console.log('Products found:', products);

    // check if all products have same store id
    const storeIds = new Set(products.map((product) => product.store_id));

    if (storeIds.size > 1) {
      return Response.json(
        { error: 'All products in an order must belong to the same store' },
        { status: 400 }
      );
    }

    // save store id from products
    const storeId = storeIds.values().next().value;

    // Fetch the store's WhatsApp number now that we have storeId.
    // We need this regardless of order success/failure path below,
    // so fetching it here (rather than after order insert) keeps
    // the data we need available throughout.
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('whatsapp_number')
      .eq('id', storeId)
      .single();

    if (storeError) {
      console.error('Store fetch error:', storeError);
      // Not fatal to the order itself — log it, but don't block the
      // customer from placing their order just because we couldn't
      // read the store's WhatsApp number.
    }

    // Helper to pick whichever image should represent a product in
    // the order: primary if marked, otherwise the first available,
    // otherwise null.
    function getPrimaryImageUrl(
      images: { image_url: string; is_primary: boolean }[] | null | undefined
    ): string | null {
      if (!images || images.length === 0) return null;
      const primary = images.find((img) => img.is_primary);
      return primary ? primary.image_url : images[0].image_url;
    }

    // Create a map of productId -> product for easy lookup
    const productMap = new Map(products.map(p => [p.id, p]));

    // Calculate totals using actual prices from database
    let totalPrice = 0;
    let totalQuantity = 0;

    const orderItems = items.map((item: { productId: number, quantity: number }) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      totalQuantity += item.quantity;
      totalPrice += product.price * item.quantity;

      return {
        product_id: item.productId,
        quantity: item.quantity,
        price: product.price // Save price at time of order
      };
    });

    const { data: orderData, error } = await supabase
      .from('orders')
      .insert({
        customer_name: name,
        customer_number: number,
        total_items: totalItems,
        total_quantity: totalQuantity,
        total_price: totalPrice,
        store_id: storeId,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      console.error('Insert error:', error);
      return Response.json(
        { error: 'Failed to place order' },
        { status: 500 }
      );
    }
    console.log('Order inserted:', orderData);

    // Insert order items with product details
    const orderItemsPayload = items.map((item: { productId: number; quantity: number }) => {
      const product = productMap.get(item.productId);

      return {
        order_id: orderData.id,
        product_id: item.productId,
        product_name: product.name,
        product_price: product.price,
        // Fixed: product.image_url no longer exists on the products
        // table now that images live in product_images. Resolved via
        // the helper above instead.
        product_image: getPrimaryImageUrl(product.product_images),
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    });

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (orderItemsError) {
      console.error('Order items error:', orderItemsError);

      // optional: rollback order if items fail (good practice)
      await supabase.from('orders').delete().eq('id', orderData.id);

      return Response.json(
        { error: 'Failed to insert order items' },
        { status: 500 }
      );
    }

    // ── Build the WhatsApp link, if the store has a usable number ──
    const sanitizedNumber = sanitizePhoneForWhatsApp(storeData?.whatsapp_number);

    let whatsappUrl: string | null = null;

    if (sanitizedNumber) {
      const message = buildWhatsAppMessage({
        customerName: name,
        orderId: orderData.id,
        orderItems: orderItemsPayload,
        totalPrice,
      });

      whatsappUrl = `https://wa.me/${sanitizedNumber}?text=${encodeURIComponent(message)}`;
    }

    return Response.json(
      {
        message: "Order placed successfully",
        orderId: orderData.id,
        // null when the store has no valid WhatsApp number set — the
        // frontend is expected to handle this by showing a fallback
        // (e.g. "order placed, but seller has no WhatsApp linked yet")
        // rather than assuming this is always present.
        whatsappUrl,
        hasWhatsapp: Boolean(whatsappUrl),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
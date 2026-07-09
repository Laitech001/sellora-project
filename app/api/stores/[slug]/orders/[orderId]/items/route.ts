import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabaseServer';

type ParamsProps = {
  params: Promise<{
    slug: string;
    orderId: string;
  }>
}

export async function GET(req: Request, context: ParamsProps) {
  const { slug, orderId } = await context.params;
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }

  if (!slug || !orderId) {
    return NextResponse.json(
      { error: 'Missing store slug or order ID' },
      { status: 400 }
    );
  }

  try {
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id, user_id')
      .eq('slug', slug)
      .single();
    
    if (storeError) {
      if (storeError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 });
      }

      console.error('Store fetch error:', storeError);
      return NextResponse.json({ error: 'Failed to fetch store data' }, { status: 500 });
    }

    if (storeData.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Verify the order actually belongs to this store before fetching its items
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, store_id")
      .eq("id", orderId)
      .single();

    if (orderError) {
      if (orderError.code === "PGRST116") {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      console.error("Order fetch error:", orderError);
      return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }

    if (orderData.store_id !== storeData.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (orderItemsError) {
      console.error('Order items fetch error:', orderItemsError);
      return NextResponse.json({ error: 'Failed to fetch order items' }, { status: 500 });
    }

    return NextResponse.json({ orderItems }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
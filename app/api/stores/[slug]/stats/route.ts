import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

type OrderPrice = {
  total_price: number;
};

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(req: Request, context: ParamsProps) {
  const { slug } = await context.params;
  const supabase = await createClient();

  // Get the logged in user server-side
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!slug) {
    return Response.json(
      { error: 'Missing store slug' },
      { status: 400 }
    );
  }

  try {
    // Get store by slug
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', slug)
      .single();

    if (storeError) {
      console.error('Store fetch error:', storeError);

      return Response.json(
        { error: 'Failed to fetch store data' },
        { status: 500 }
      );
    }

    if (!storeData) {
      return Response.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const storeId = storeData.id;

    // Run queries in parallel
    const [
      productsRes,
      ordersRes,
      pendingRes,
      salesRes
    ] = await Promise.all([
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId),

      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId),

      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', storeId)
        .eq('status', 'pending'),

      supabase
        .from('orders')
        .select('total_price')
        .eq('store_id', storeId)
    ]);

    // Handle query errors
    if (
      productsRes.error ||
      ordersRes.error ||
      pendingRes.error ||
      salesRes.error
    ) {
      console.error('Database errors:', {
        products: productsRes.error,
        orders: ordersRes.error,
        pending: pendingRes.error,
        sales: salesRes.error,
      });

      return Response.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    // Counts
    const totalProducts = productsRes.count ?? 0;
    const totalOrders = ordersRes.count ?? 0;
    const pendingOrders = pendingRes.count ?? 0;

    // Total sales
    const orders: OrderPrice[] = salesRes.data ?? [];

    const totalSales = orders.reduce(
      (sum, order) => sum + (order.total_price || 0),
      0
    );

    return Response.json({
      totalProducts,
      totalOrders,
      pendingOrders,
      totalSales,
    });

  } catch (error) {
    console.error('Unexpected error:', error);

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { supabase } from '@/lib/supabase';

type ParamaProps = {
  params: Promise<{
    slug: string;
  }>
}

export async function GET(req: Request, contect: ParamaProps) {
  const { slug } = await contect.params;

  if (!slug) {
    return Response.json({ error: 'Missing store slug' }, { status: 400 });
  }

  try {
    // get store data
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .single();

    // handle case where there is an error fetching store data
    if (storeError) {
      return Response.json({ error: 'Failed to fetch store data' }, { status: 500 });
    }

    //handle case where store is not found
    if (!storeData) {
      return Response.json({ error: 'Store not found' }, { status: 404 });
    }

    // get orders for the store
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', storeData.id);

    if (ordersError) {
      return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return Response.json({ store: storeData, orders: ordersData });
  } catch (error) {
    return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
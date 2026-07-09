import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabaseServer';

type ParamaProps = {
  params: Promise<{
    slug: string;
  }>
}

export async function GET(req: Request, context: ParamaProps) {
  const { slug } = await context.params;
  const supabase = await createClient();

  console.log('GET request received for orders with slug:', slug);

  // get logged in user server-side
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }

  if (!slug) {
    return NextResponse.json({ error: 'Missing store slug' }, { status: 400 });
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
      return NextResponse.json({ error: 'Failed to fetch store data' }, { status: 500 });
    }

    // handle case where store is not found
    if (!storeData) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    if (storeData) {
      console.log('Store data:', storeData);
    }

    // check if the logged-in user is the owner of the store
    if (storeData.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // get orders for the store
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('store_id', storeData.id);

    if (ordersError) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ store: storeData, orders: ordersData });
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
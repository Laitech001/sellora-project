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

  // get logged in user server-side
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Unauthorized" }, 
      { status: 401 }
    );
  }

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing store slug' },
      { status: 400 }
    );
  }

  try {
    // get store data 
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('*')
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

    return NextResponse.json(
      { store: storeData },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
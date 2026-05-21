import { supabase } from '@/lib/supabase';

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>
}

interface storeDataProps {
  id: string;
  name: string;
  slug: string;
}

export async function GET(req: Request, context: ParamsProps) {
  const { slug } = await context.params;

  console.log('Received GET request for products with slug:', slug);

  if (!slug) {
    return Response.json({ error: 'Missing store slug' }, { status: 400 });
  }

  try {
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id, name, slug')
      .eq('slug', slug)
      .single();

    if (storeError) {
      return Response.json({ error: storeError.message }, { status: 500 });
    }

    if (!storeData) {
      return Response.json({ error: 'Store not found' }, { status: 404 });
    }

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeData.id);

    console.log('Store data:', storeData);
    console.log('Store ID:', storeData.id);

    if (productsError) {
      console.error('Products error:', productsError);
      return Response.json(
        { error: productsError.message ?? 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return Response.json({ store: storeData, products: productsData });
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST /api/stores/[slug]/products
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const stock = formData.get('stock') as string;
    const image = formData.get('image') as File | null;
    const storeSlug = formData.get('storeSlug') as string;

    let imageUrl = '';

    // Only upload image if one is provided
    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from('product-image')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-image")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // get store id by slug
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', storeSlug)
      .single();

    // handle case where there is an error fetching store data
    if (storeError) {
      console.error('Error fetching store data:', storeError);
      throw new Error('Failed to fetch store data');
    }

    // handle case where store is not found
    if(!storeData) {
      console.error('Store not found for slug:', storeSlug);
      throw new Error('Store not found');
    }

    const { error } = await supabase
      .from('products')
      .insert({
        name,
        price: Number(price),
        description,
        stock: Number(stock),
        image_url: imageUrl,
        store_id: storeData.id,
      });

    if (error) throw error;

    return new Response(JSON.stringify({ message: 'Product added successfully' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to add product' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

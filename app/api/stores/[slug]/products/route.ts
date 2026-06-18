import { supabase } from '@/lib/supabase';

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>
};

export async function GET(req: Request, context: ParamsProps) {
  const { slug } = await context.params;

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
      .select('*, product_images(*)')
      .eq('store_id', storeData.id)
      .order('created_at', { ascending: false });

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

// ============================================================
// POST /api/stores/[slug]/products
//
// Creates a new product, uploads up to 4 images to Storage,
// and inserts one row per image into product_images.
// ============================================================
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const stock = formData.get('stock') as string;
    const storeSlug = formData.get('storeSlug') as string;

    // frontend appends every file under the same key: 'images'.
    // formData.getAll() (not .get()) returns ALL values for that key
    // as an array — this is how I receive multiple files from one field.
    const imageFiles = formData.getAll('images') as File[];

    // Validate required fields
    if (!storeSlug) {
      return Response.json({ error: 'Missing store slug' }, { status: 400 });
    }

    if (!name?.trim()) {
      return Response.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return Response.json({ error: 'Price must be a positive number' }, { status: 400 });
    }

    if (!description?.trim()) {
      return Response.json({ error: 'Description is required' }, { status: 400 });
    }

    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      return Response.json({ error: 'Stock must be a non-negative number' }, { status: 400 });
    }

    // Look up the store first — I need its id before I can insert
    // the product (products.store_id is a foreign key to stores.id).
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('id')
      .eq('slug', storeSlug)
      .single();

    if (storeError) {
      console.error('Error fetching store data:', storeError);
      throw new Error('Failed to fetch store data');
    }

    if (!storeData) {
      console.error('Store not found for slug:', storeSlug);
      throw new Error('Store not found');
    }

    // Insert the product row FIRST, before touching images.
    // Why: product_images.product_id needs a real product id to point to,
    // so the product must exist before we can attach images to it.
    const { data: newProduct, error: productInsertError } = await supabase
      .from('products')
      .insert({
        name,
        price: Number(price),
        description,
        stock: Number(stock),
        store_id: storeData.id,
      })
      .select('id')
      .single();

    if (productInsertError) {
      console.error('Product insert error:', productInsertError);
      throw new Error(`Failed to insert product: ${productInsertError.message}`);
    }
    if (!newProduct) throw new Error('Product insert returned no data');

    const productId = newProduct.id;

    // Upload each image file to Storage, one at a time, and collect
    // the data I'll need to insert into product_images afterward.
    const imageRows: {
      product_id: string;
      image_url: string;
      storage_path: string;
      is_primary: boolean;
    }[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];

      // Skip anything that isn't actually a file (e.g. an empty entry)
      if (!file || typeof file === 'string') continue;

      // Unique filename: timestamp + index + original name, so two
      // images uploaded in the same millisecond never collide.
      const storagePath = `${productId}/${Date.now()}-${i}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('product-image')
        .upload(storagePath, file);

      if (uploadError) {
        console.error(`Failed to upload image ${i}:`, uploadError);
        continue; // one failed image shouldn't kill the whole product creation
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-image')
        .getPublicUrl(storagePath);

      imageRows.push({
        product_id: productId,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        is_primary: i === 0, // first image uploaded becomes the cover image
      });
    }

    // Insert all image rows in a single call rather than one-by-one —
    // fewer round trips to the database, and they either all succeed
    // or all fail together.
    if (imageRows.length > 0) {
      const { error: imagesInsertError } = await supabase
        .from('product_images')
        .insert(imageRows);

      if (imagesInsertError) {
        console.error('Failed to insert image rows:', imagesInsertError);
        // Note: the product itself was still created successfully.
        // We don't throw here, since the product existing without
        // images is recoverable — the user can add images later.
      }
    }

    return Response.json(
      { message: 'Product added successfully', productId },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in POST /api/stores/[slug]/products:', errorMessage, error);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
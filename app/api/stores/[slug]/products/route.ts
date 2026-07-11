import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>
};

export async function GET(req: Request, context: ParamsProps) {
  const { slug } = await context.params;
  const supabase = await createClient();

  // Get the logged in user server-side
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
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
      return NextResponse.json({ error: storeError.message }, { status: 500 });
    }

    // handle case where store is not found
    if (!storeData) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // check if the logged-in user is the owner of the store
    if (storeData.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('store_id', storeData.id)
      .order('created_at', { ascending: false });

    if (productsError) {
      console.error('Products error:', productsError);
      return NextResponse.json(
        { error: productsError.message ?? 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ store: storeData, products: productsData });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

// POST route for adding a new product to a store;
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const NAME_MAX_LENGTH = 150;
const DESCRIPTION_MAX_LENGTH = 2000;

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const storeSlug = formData.get("storeSlug") as string | null;
    const name = (formData.get("name") as string | null)?.trim();
    const price = formData.get("price") as string | null;
    const description = (formData.get("description") as string | null)?.trim();
    const stock = formData.get("stock") as string | null;
    const imageFiles = formData.getAll("images") as File[];

    if (!storeSlug) {
      return NextResponse.json({ error: "Missing store slug" }, { status: 400 });
    }

    if (!name || name.length < 2 || name.length > NAME_MAX_LENGTH) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const priceNum = Number(price);
    if (!price || !Number.isFinite(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
    }

    if (!description || description.length > DESCRIPTION_MAX_LENGTH) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    const stockNum = Number(stock);
    if (!stock || !Number.isInteger(stockNum) || stockNum < 0) {
      return NextResponse.json({ error: "Stock must be a non-negative whole number" }, { status: 400 });
    }

    const actualFiles = imageFiles.filter((f) => f instanceof File && f.size > 0);

    if (actualFiles.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed` }, { status: 400 });
    }

    for (const file of actualFiles) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported image type: ${file.type}` }, { status: 400 });
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: `Image "${file.name}" exceeds 5MB limit` }, { status: 400 });
      }
    }

    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("id, user_id")
      .eq("slug", storeSlug)
      .single();

    if (storeError) {
      if (storeError.code === "PGRST116") {
        return NextResponse.json({ error: "Store not found" }, { status: 404 });
      }
      console.error("Store fetch error:", storeError);
      return NextResponse.json({ error: "Failed to fetch store data" }, { status: 500 });
    }

    if (storeData.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: newProduct, error: productInsertError } = await supabase
      .from("products")
      .insert({
        name,
        price: priceNum,
        description,
        stock: stockNum,
        store_id: storeData.id,
      })
      .select("id")
      .single();

    if (productInsertError || !newProduct) {
      console.error("Product insert error:", productInsertError);
      return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }

    const productId = newProduct.id;

    const imageRows: {
      product_id: string;
      image_url: string;
      storage_path: string;
      is_primary: boolean;
    }[] = [];

    for (let i = 0; i < actualFiles.length; i++) {
      const file = actualFiles[i];
      const storagePath = `${productId}/${Date.now()}-${i}-${sanitizeFileName(file.name)}`;

      const { error: uploadError } = await supabase.storage
        .from("product-image")
        .upload(storagePath, file, { contentType: file.type });

      if (uploadError) {
        console.error(`Failed to upload image ${i}:`, uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-image")
        .getPublicUrl(storagePath);

      imageRows.push({
        product_id: productId,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        is_primary: i === 0,
      });
    }

    if (imageRows.length > 0) {
      const { error: imagesInsertError } = await supabase
        .from("product_images")
        .insert(imageRows);

      if (imagesInsertError) {
        console.error("Failed to insert image rows:", imagesInsertError);
      }
    }

    return NextResponse.json(
      { message: "Product added successfully", productId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/stores/[slug]/products:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
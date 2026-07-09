import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

type ParamsProps = {
  params: Promise<{
    slug: string;
    productId: string;
  }>
};

export async function DELETE(request: Request, context: ParamsProps) {

  // Await params first
  const { productId, slug } = await context.params;
  const supabase = await createClient();

  // Get the logged in user server-side
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Now check productId and slug (not params.slug) because we only need productId for deletion
  if (!productId || !slug) {
    return Response.json(
      { success: false, message: 'Missing product ID or store slug' },
      { status: 400 }
    );
  }

  // Validate it's a number
  const id = Number(productId);
  if (isNaN(id)) {
    return Response.json(
      { success: false, message: 'Invalid product ID' },
      { status: 400 }
    );
  }

  try {

    // fetch store data to check ownership
    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .single();

    if (storeError) {
      console.error('Store error:', storeError);
      return Response.json(
        { success: false, message: 'Failed to fetch store data' },
        { status: 500 }
      );
    }

    if (!storeData) {
      return Response.json(
        { success: false, message: 'Store not found' },
        { status: 404 }
      );
    }

    // Verify the product belongs to this store
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id, store_id')
      .eq('id', id)
      .single();

    if (productError) {
      if (productError.code === 'PGRST116') {
        return Response.json({ success: false, message: 'Product not found' }, { status: 404 });
      }
      console.error('Product fetch error:', productError);
      return Response.json({ success: false, message: 'Failed to fetch product data' }, { status: 500 });
    }

    if (productData.store_id !== storeData.id) {
      return Response.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // check if the logged-in user is the owner of the store
    if (storeData.user_id !== user.id) {
      return Response.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if product is used in order
    const { data: orderItems, error: orderCheckError } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', id)
      .limit(1);

    if (orderCheckError) {
      console.error('Error checking order:', orderCheckError);
      return Response.json(
        { success: false, message: 'Failed to check product usage'},
        { status: 500 }
      );
    }

    // prevent deletion if product is used in order
    if (orderItems && orderItems.length > 0) {
      return Response.json(
        { success: false,
          message: "This product cannot be deleted because it has existing orders."
        },
        { status: 400 },
      )
    }

    // get product images;
    const { data: images } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', id);

    // Delete files from storage;
    if (images?.length) {
      await supabase.storage
        .from("product-image")
        .remove(images.map(img => img.storage_path));
    }

    // delete images that reference products.id
    const { error: imageError } = await supabase
      .from('product_images')
      .delete()
      .eq('product_id', productId);
      
    if (imageError) {
      console.error('Deleting Image error:', imageError);
      return Response.json(
        { success: false, message: imageError.message },
        { status: 500 }
      );
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Delete error:', error);
      return Response.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
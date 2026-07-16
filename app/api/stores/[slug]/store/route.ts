import { NextResponse } from "next/server";
import { createClient } from '@/lib/supabaseServer';
import { createAdminClient } from '@/lib/supabaseAdmin';

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>
}

export async function GET(req: Request, context: ParamsProps) {
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

export async function DELETE(request: Request, context: ParamsProps) {
  const { slug } = await context.params;
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!slug) {
    return NextResponse.json({ error: "Missing store slug" }, { status: 400 });
  }

  try {
    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("id, user_id")
      .eq("slug", slug)
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

    const storeId = storeData.id;
    const admin = createAdminClient();

    const { data: products, error: productsError } = await admin
      .from("products")
      .select("id")
      .eq("store_id", storeId);

    if (productsError) {
      console.error("Products fetch error:", productsError);
      return NextResponse.json({ error: "Failed to fetch store products" }, { status: 500 });
    }

    const productIds = (products ?? []).map((p) => p.id);

    if (productIds.length > 0) {
      const { data: images, error: imagesError } = await admin
        .from("product_images")
        .select("storage_path")
        .in("product_id", productIds);

      if (imagesError) {
        console.error("Product images fetch error:", imagesError);
        return NextResponse.json({ error: "Failed to fetch product images" }, { status: 500 });
      }

      const imagePaths = (images ?? []).map((img) => img.storage_path).filter(Boolean);
      if (imagePaths.length > 0) {
        const { error: removeImagesError } = await admin.storage
          .from("product-image")
          .remove(imagePaths);
        if (removeImagesError) {
          console.error("Failed to remove product images from storage:", removeImagesError);
        }
      }
    }

    const { data: logoFiles, error: logoListError } = await admin.storage
      .from("store-logos")
      .list(String(storeId));

    if (logoListError) {
      console.error("Failed to list store logo files:", logoListError);
    } else if (logoFiles && logoFiles.length > 0) {
      const logoPaths = logoFiles.map((f) => `${storeId}/${f.name}`);
      const { error: removeLogoError } = await admin.storage.from("store-logos").remove(logoPaths);
      if (removeLogoError) {
        console.error("Failed to remove store logo files:", removeLogoError);
      }
    }

    const { data: orders, error: ordersFetchError } = await admin
      .from("orders")
      .select("id")
      .eq("store_id", storeId);

    if (ordersFetchError) {
      console.error("Orders fetch error:", ordersFetchError);
      return NextResponse.json({ error: "Failed to fetch store orders" }, { status: 500 });
    }

    const orderIds = (orders ?? []).map((o) => o.id);

    if (orderIds.length > 0) {
      const { error: orderItemsDeleteError } = await admin
        .from("order_items")
        .delete()
        .in("order_id", orderIds);

      if (orderItemsDeleteError) {
        console.error("Order items delete error:", orderItemsDeleteError);
        return NextResponse.json({ error: "Failed to delete order items" }, { status: 500 });
      }
    }

    const { error: ordersDeleteError } = await admin
      .from("orders")
      .delete()
      .eq("store_id", storeId);

    if (ordersDeleteError) {
      console.error("Orders delete error:", ordersDeleteError);
      return NextResponse.json({ error: "Failed to delete orders" }, { status: 500 });
    }

    if (productIds.length > 0) {
      const { error: productImagesDeleteError } = await admin
        .from("product_images")
        .delete()
        .in("product_id", productIds);

      if (productImagesDeleteError) {
        console.error("Product images row delete error:", productImagesDeleteError);
        return NextResponse.json({ error: "Failed to delete product images" }, { status: 500 });
      }
    }

    const { error: productsDeleteError } = await admin
      .from("products")
      .delete()
      .eq("store_id", storeId);

    if (productsDeleteError) {
      console.error("Products delete error:", productsDeleteError);
      return NextResponse.json({ error: "Failed to delete products" }, { status: 500 });
    }

    const { error: storeDeleteError } = await admin
      .from("stores")
      .delete()
      .eq("id", storeId);

    if (storeDeleteError) {
      console.error("Store delete error:", storeDeleteError);
      return NextResponse.json({ error: "Failed to delete store" }, { status: 500 });
    }

    return NextResponse.json({ message: "Store deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error deleting store:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
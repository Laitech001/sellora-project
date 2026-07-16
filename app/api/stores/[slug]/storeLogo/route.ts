import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
}

type ParamsProps = {
  params: Promise<{
    slug: string;
  }>;
};

// POST /api/stores/[slug]/storeLogo
export async function POST(request: Request, context: ParamsProps) {
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
    const formData = await request.formData();
    const file = formData.get("logo") as File | null;

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No logo file provided" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported image type: ${file.type}` }, { status: 400 });
    }

    if (file.size > MAX_LOGO_SIZE) {
      return NextResponse.json({ error: "Logo must be under 2MB" }, { status: 400 });
    }

    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("id, user_id, logo_storage_path")
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

    const storagePath = `${storeData.id}/${Date.now()}-${sanitizeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("store-logos")
      .upload(storagePath, file, { contentType: file.type });

    if (uploadError) {
      console.error("Logo upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("store-logos")
      .getPublicUrl(storagePath);

    const { error: updateError } = await supabase
      .from("stores")
      .update({
        logo_url: publicUrlData.publicUrl,
        logo_storage_path: storagePath,
      })
      .eq("id", storeData.id);

    if (updateError) {
      console.error("Store logo update error:", updateError);
      await supabase.storage.from("store-logos").remove([storagePath]);
      return NextResponse.json({ error: "Failed to save logo" }, { status: 500 });
    }

    if (storeData.logo_storage_path) {
      await supabase.storage.from("store-logos").remove([storeData.logo_storage_path]);
    }

    return NextResponse.json(
      { message: "Logo uploaded successfully", logoUrl: publicUrlData.publicUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error uploading logo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/stores/[slug]/storeLogo
export async function PATCH(request: Request, context: ParamsProps) {
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
    const formData = await request.formData();
    const file = formData.get("logo") as File | null;

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No logo file provided" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported image type: ${file.type}` }, { status: 400 });
    }

    if (file.size > MAX_LOGO_SIZE) {
      return NextResponse.json({ error: "Logo must be under 2MB" }, { status: 400 });
    }

    const { data: storeData, error: storeError } = await supabase
      .from("stores")
      .select("id, user_id, logo_storage_path")
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

    const storagePath = `${storeData.id}/${Date.now()}-${sanitizeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("store-logos")
      .upload(storagePath, file, { contentType: file.type });

    if (uploadError) {
      console.error("Logo upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("store-logos")
      .getPublicUrl(storagePath);

    const { data: updatedStore, error: updateError } = await supabase
      .from("stores")
      .update({
        logo_url: publicUrlData.publicUrl,
        logo_storage_path: storagePath,
      })
      .eq("id", storeData.id)
      .select("id, logo_url, updated_at")
      .single();

    if (updateError) {
      console.error("Store logo update error:", updateError);
      await supabase.storage.from("store-logos").remove([storagePath]);
      return NextResponse.json({ error: "Failed to save logo" }, { status: 500 });
    }

    if (storeData.logo_storage_path) {
      const { error: removeOldError } = await supabase.storage
        .from("store-logos")
        .remove([storeData.logo_storage_path]);

      if (removeOldError) {
        console.error("Failed to remove old logo:", removeOldError);
      }
    }

    return NextResponse.json(
      { message: "Logo updated successfully", logoUrl: updatedStore.logo_url, updatedAt: updatedStore.updated_at },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error updating logo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
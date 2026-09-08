import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>
}

type ParamsProps = {
  params: Promise<{
    id: string;
  }>
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
  
    // Get the logged in user server-side
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', id)
      .single();

    if (error) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

const MAX_IMAGES = 4;

// ============================================================
// PATCH /api/products/[productId]
//
// Handles three independent concerns in one request:
//   1. Updating text fields (name, price, description, stock)
//   2. Removing specific images (by their product_images.id)
//   3. Adding new image files (same upload pattern as POST)
//
// Order of operations, and why:
//   Step 1: Update text fields — no dependency on images, do it first.
//   Step 2: Remove images — delete storage files AND db rows for
//           anything the frontend marked for removal.
//   Step 3: Check the 4-image cap — must happen AFTER removals,
//           otherwise a full product could never swap an image out.
//   Step 4: Upload + insert new images.
//   Step 5: If the primary image was removed, promote the oldest
//           remaining image to primary so the product always has one
//           (unless it now has zero images at all).
// ============================================================
export async function PATCH(request: Request, context: ParamsProps) {
  const { id } = await context.params;
  const supabase = await createClient();
  
  // Get the logged in user server-side
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (!id) {
    return Response.json({ error: 'Missing product id' }, { status: 400 });
  }

  try {
    const formData = await request.formData();

    const name = formData.get('name') as string | null;
    const price = formData.get('price') as string | null;
    const description = formData.get('description') as string | null;
    const stock = formData.get('stock') as string | null;

    const removeImageIds = formData.getAll('removeImageIds') as string[];

    const newImageFiles = formData.getAll('images') as File[];

    const fieldsToUpdate: Record<string, string | number> = {};
    if (name !== null) fieldsToUpdate.name = name;
    if (price !== null) fieldsToUpdate.price = Number(price);
    if (description !== null) fieldsToUpdate.description = description;
    if (stock !== null) fieldsToUpdate.stock = Number(stock);

    if (Object.keys(fieldsToUpdate).length > 0) {
      const { error: updateError } = await supabase
        .from('products')
        .update(fieldsToUpdate)
        .eq('id', id);

      if (updateError) throw updateError;
    }

    // ── Step 2: Remove images, if any were requested ──
    if (removeImageIds.length > 0) {
      // Fetch storage_path for the images being removed BEFORE deleting
      // their rows — same reasoning as DELETE: once the row is gone,
      // we lose the information needed to clean up Storage.
      const { data: imagesToRemove, error: fetchRemoveError } = await supabase
        .from('product_images')
        .select('id, storage_path')
        .in('id', removeImageIds);

      if (fetchRemoveError) {
        console.error('Failed to fetch images for removal:', fetchRemoveError);
      }

      if (imagesToRemove && imagesToRemove.length > 0) {
        const pathsToDelete = imagesToRemove
          .map((img) => img.storage_path)
          .filter((path): path is string => Boolean(path));

        if (pathsToDelete.length > 0) {
          const { error: storageDeleteError } = await supabase.storage
            .from('product-image')
            .remove(pathsToDelete);

          if (storageDeleteError) {
            console.error('Failed to delete storage files:', storageDeleteError);
            // Not throwing — proceed to remove the DB rows regardless,
            // same reasoning as the DELETE route.
          }
        }

        const { error: removeRowsError } = await supabase
          .from('product_images')
          .delete()
          .in('id', removeImageIds);

        if (removeRowsError) throw removeRowsError;
      }
    }

    // ── Step 3: Check the 4-image cap, AFTER removals ──
    // We need the current count to know how many new images we're
    // allowed to accept.
    const { data: remainingImages, error: countError } = await supabase
      .from('product_images')
      .select('id, is_primary')
      .eq('product_id', id);

    if (countError) throw countError;

    const currentCount = remainingImages?.length ?? 0;
    const availableSlots = MAX_IMAGES - currentCount;
    const filesToUpload = newImageFiles.slice(0, Math.max(availableSlots, 0));

    // ── Step 4: Upload + insert new images ──
    const newImageRows: {
      product_id: string;
      image_url: string;
      storage_path: string;
      is_primary: boolean;
    }[] = [];

    const hadAnyImageBeforeUpload = currentCount > 0;

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      if (!file || typeof file === 'string') continue;

      const storagePath = `${id}/${Date.now()}-${i}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('product-image')
        .upload(storagePath, file);

      if (uploadError) {
        console.error(`Failed to upload image ${i}:`, uploadError);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-image')
        .getPublicUrl(storagePath);

      newImageRows.push({
        product_id: id,
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        // Only the very first image ever added to a product (i.e. it had
        // zero images before this request AND this is the first new file)
        // becomes primary automatically. Otherwise, newly added images
        // are NOT primary by default — the existing primary stays primary.
        is_primary: !hadAnyImageBeforeUpload && i === 0,
      });
    }

    if (newImageRows.length > 0) {
      const { error: insertError } = await supabase
        .from('product_images')
        .insert(newImageRows);

      if (insertError) {
        console.error('Failed to insert new image rows:', insertError);
      }
    }

    // ── Step 5: If the primary image was removed, promote the oldest
    //     remaining image to primary ──
    const stillHasPrimary = remainingImages?.some((img) => img.is_primary);

    if (!stillHasPrimary && remainingImages && remainingImages.length > 0) {
      // "Oldest remaining" = the first row returned when ordered by
      // created_at ascending. We didn't select created_at above, so
      // re-fetch just this one ordered query.
      const { data: oldestImage, error: oldestFetchError } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (!oldestFetchError && oldestImage) {
        const { error: promoteError } = await supabase
          .from('product_images')
          .update({ is_primary: true })
          .eq('id', oldestImage.id);

        if (promoteError) {
          console.error('Failed to promote new primary image:', promoteError);
        }
      }
    }

    return Response.json({ message: 'Product updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error updating product:', error);
    return Response.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
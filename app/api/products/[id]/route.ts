import { supabase } from "@/lib/supabase";

type Params = {
  params: {
    id: string;
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
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

export async function PUT(request: Request, { params }: Params) {
  try { 
    const { id } = await params;
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;
    const stock = parseInt(formData.get('stock') as string, 10);
    const image = formData.get('image') as File | null;

    let updateData: any = {
      name,
      price,
      description,
      stock,
    };

    // Only upload and update image if a new image is provided
    if (image) {
      const fileName = `${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from('product-image')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-image")
        .getPublicUrl(fileName);

      updateData.image_url = data.publicUrl;
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);
 
    if (error) {
      return Response.json(
        { error: "Update failed" },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: "Updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

type ParamsProps = {
  params: Promise<{
    id: string;
  }>
}

export async function DELETE(request: Request, context: ParamsProps) {
  try {
    // Await params first
    const params = await context.params;
    const { id } = params;

    // Now check id (not params.id)
    if (!id) {
      return Response.json(
        { success: false, message: 'Missing product ID' },
        { status: 400 }
      );
    }

    // Validate it's a number
    const productId = Number(id);
    if (isNaN(productId)) {
      return Response.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if product is used in order
    const { data: orders, error: orderCheckError } = await supabase
      .from('orders')
      .select('id')
      .eq('product_id', productId)
      .limit(1);

    if (orderCheckError) {
      console.error('Errro checking order:', orderCheckError);
      return Response.json(
        { success: false, message: 'Failed to check product usage'},
        { status: 500 }
      );
    }

    // prevent deletion if product is used in order
    if (orders && orders.length > 0) {
      return Response.json(
        { success: false,
          message: 'Cannot delete product, it is refrenced in existing order'
        },
        { status: 409 },
      )
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
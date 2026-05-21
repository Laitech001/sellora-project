import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      product:products (
        name
      )
    `);

  if (error) {
    console.error(error);
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }

  return Response.json(data);
}

export async function POST(request: Request) {
  try {
    console.log('Received order POST request');
    const payload = await request.json();
    console.log('Payload:', payload);

    const { name, number, items } = payload;

    // handle missing/incorrect fields;
    if (!name || !number || !items || !Array.isArray(items) || items.length === 0) {
      console.log('Missing required fields:', { name, number, items });
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // get total Items from order items
    const totalItems: number = items.length;

    // get all product ids from order items
    const productIds = items.map((item: { productId: number }) => item.productId);
    console.log('Product IDs:', productIds);

    // validate product ids
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productError) {
      console.error('Product error:', productError);
      return Response.json(
        { error: 'Invalid product IDs in order' },
        { status: 400 }
      );
    }

    if (products.length !== productIds.length) {
      console.log('Some products not found');
      return Response.json(
        { error: 'Some products not found' },
        { status: 400 }
      );
    }
    console.log('Products found:', products);

    // check if all products have same store id
    const storeIds = new Set(products.map((product) => product.store_id));

    if (storeIds.size > 1) {
      return Response.json(
        { error: 'All products in an order must belong to the same store' },
        { status: 400 }
      );
    }

    // save store id from products
    const storeId = storeIds.values().next().value;

    // Create a map of productId -> product for easy lookup
    const productMap = new Map(products.map(p => [p.id, p]));

    // Calculate totals using actual prices from database
    let totalPrice = 0;
    let totalQuantity = 0;
    
    const orderItems = items.map((item: { productId: number, quantity: number }) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      totalQuantity += item.quantity;
      totalPrice += product.price * item.quantity;
      
      return {
        product_id: item.productId,
        quantity: item.quantity,
        price: product.price // Save price at time of order
      };
    });

    const { data: orderData, error } = await supabase
      .from('orders')
      .insert({
        customer_name: name,
        customer_number: number,
        total_items: totalItems,
        total_quantity: totalQuantity,
        total_price: totalPrice,
        store_id: storeId,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      console.error('Insert error:', error);
      return Response.json(
        { error: 'Failed to place order' },
        { status: 500 }
      );
    }
    console.log('Order inserted:', orderData);

    // Insert order items with product details
    const orderItemsPayload = items.map((item: { productId: number; quantity: number }) => {
      const product = productMap.get(item.productId);

      return {
        order_id: orderData.id,
        product_id: item.productId,
        product_name: product.name,
        product_price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    });

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (orderItemsError) {
      console.error('Order items error:', orderItemsError);

      // optional: rollback order if items fail (good practice)
      await supabase.from('orders').delete().eq('id', orderData.id);

      return Response.json(
        { error: 'Failed to insert order items' },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Order placed successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
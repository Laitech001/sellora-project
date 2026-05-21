// import { supabase } from "@/lib/supabase";

// type Params = {
//   params: Promise<{
//     id: string;
//   }>
// }

// export async function PATCH(req: Request, context: Params) {
//   try {
//     // In Next.js 15+, params is a Promise
//     const params = await context.params;
    
//     if (!params?.id) {
//       return Response.json(
//         { success: false, message: 'Missing order ID' },
//         { status: 400 }
//       );
//     }

//     const payload = await req.json();
//     const status = payload?.status;

//     if (typeof status !== 'string' || !status.trim()) {
//       return Response.json(
//         { success: false, message: 'Invalid status value' },
//         { status: 400 }
//       );
//     }

//     // Validate ID is a number
//     const orderId = Number(params.id);
//     if (isNaN(orderId)) {
//       return Response.json(
//         { success: false, message: 'Invalid order ID' },
//         { status: 400 }
//       );
//     }

//     const { data, error } = await supabase
//       .from('orders')
//       .update({ status: status.trim() })
//       .eq('id', orderId)
//       .select();

//     if (error) {
//       console.error('Supabase error:', error);
//       return Response.json(
//         { success: false, message: error.message },
//         { status: 500 }
//       );
//     }

//     // Check if order was found
//     if (!data || data.length === 0) {
//       return Response.json(
//         { success: false, message: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     return Response.json(
//       { success: true, data: data[0], message: 'Order updated successfully' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Failed to update order status:', error);
//     return Response.json(
//       { success: false, message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
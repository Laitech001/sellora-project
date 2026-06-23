// app/api/stores/route.ts
import { createClient } from "@/lib/supabaseServer"
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the logged in user server-side
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { storeName, slug, whatsappNumber, businessType, address } = body;

    // Validate required fields
    if (!storeName || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Save to stores table — user_id comes from the verified session
    const { data, error } = await supabase
      .from('stores')
      .insert({
        name: storeName,
        slug,
        whatsapp_number: whatsappNumber,
        business_type: businessType,
        address,
        user_id: user.id,  // ← always from server session, never from client
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Store created successfully', store: data },
      { status: 201 }
    );

  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
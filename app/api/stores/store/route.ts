// app/api/stores/route.ts
import { createClient } from "@/lib/supabaseServer"
import { NextRequest, NextResponse } from 'next/server';

// --- Validation helpers ---
const SLUG_REGEX = /^[a-z0-9-]{3,50}$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;
// const ALLOWED_BUSINESS_TYPES = ['retail', 'restaurant', 'services', 'other'];

function validateStoreInput(body: any) {
  const errors: string[] = [];

  const storeName = typeof body.storeName === 'string' ? body.storeName.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';
  const whatsappNumber = typeof body.whatsappNumber === 'string' ? body.whatsappNumber.trim() : '';
  const businessType = typeof body.businessType === 'string' ? body.businessType.trim() : '';
  const address = typeof body.address === 'string' ? body.address.trim() : '';

  if (!storeName || storeName.length < 2 || storeName.length > 100) {
    errors.push('Store name must be between 2 and 100 characters');
  }

  if (!slug || !SLUG_REGEX.test(slug)) {
    errors.push('Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only');
  }

  if (whatsappNumber && !PHONE_REGEX.test(whatsappNumber)) {
    errors.push('WhatsApp number format is invalid');
  }

  // if (businessType && !ALLOWED_BUSINESS_TYPES.includes(businessType)) {
  //   errors.push('Invalid business type');
  // }

  if (address && address.length > 300) {
    errors.push('Address must be under 300 characters');
  }

  return {
    errors,
    cleaned: { storeName, slug, whatsappNumber, businessType, address },
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the logged in user server-side (verified against Supabase Auth, not just cookie-trusted)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body safely
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate input
    const { errors, cleaned } = validateStoreInput(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors[0], details: errors },
        { status: 400 }
      );
    }

    const { storeName, slug, whatsappNumber, businessType, address } = cleaned;

    // Save to stores table, user_id comes from the verified session, never from client input
    const { data, error } = await supabase
      .from('stores')
      .insert({
        name: storeName,
        slug,
        whatsapp_number: whatsappNumber || null,
        business_type: businessType || null,
        address: address || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);

      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Store slug already exists. Choose another one.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create store' },
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

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Get the logged in user server-side
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Fetch stores for the logged-in user
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', user.id);

    if (storesError) {
      return NextResponse.json(
        { error: storesError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { stores },
      { status: 200 }
    );
    
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
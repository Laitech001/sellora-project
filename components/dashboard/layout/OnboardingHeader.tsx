'use client';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui'
import { BrandLogoName } from '@/ui/Brand';
import { useLogout } from '@/hooks/useLogout';


export default function OnboardingHeader() {
  const router = useRouter();
  const { logout, isLoading } = useLogout();

  
  return (
    <>
      <div className='flex justify-between items-center bg-dark text-white w-full px-4 py-2 border-b border-slate-500'>
        <BrandLogoName />
        
        <Button
          variant='gradient'
          onClick={logout}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : 'Log Out'}
        </Button>
      </div>
    
    </>
  )
}
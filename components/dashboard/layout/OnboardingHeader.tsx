'use client';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui'
import { BrandLogoName } from '@/ui/Brand';


export default function OnboardingHeader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert('Unable to Log Out');
      return;
    }

    setIsLoading(true);
    router.push('/signup')
  }
  return (
    <>
      <div className='flex justify-between items-center bg-dark text-white w-full px-4 py-2 border-b border-slate-500'>
        <BrandLogoName />
        
        <Button
          variant='gradient'
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : 'Log Out'}
        </Button>
      </div>
    
    </>
  )
}
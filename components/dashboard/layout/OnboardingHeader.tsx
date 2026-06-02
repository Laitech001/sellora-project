'use client';
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation';
import { Button } from '@/ui'
import { BrandLogoName } from '@/ui/Brand';


export default function OnboardingHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert('Unable to Log Out');
      return;
    }

    router.push('/signup')
  }
  return (
    <>
      <div className='flex justify-between items-center bg-dark text-white w-full px-4 py-2 border-b border-slate-500'>
        <BrandLogoName />
        
        <Button
          variant='gradient'
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>
    
    </>
  )
}
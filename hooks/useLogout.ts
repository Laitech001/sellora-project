'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase'

export function useLogout() {
  const router = useRouter();
  const [ isLoading, setIsLoading ] = useState(false);

  const logout = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Unable to Log Out");
      setIsLoading(false);
      return;
    }

    router.push('/signup')
  }

  return {
    logout,
    isLoading,
  };
}
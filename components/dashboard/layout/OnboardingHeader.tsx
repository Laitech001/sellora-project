'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function OnboardingHeader() {
  return (
    <>
      {/* Mobile Layout */}
      <div className='bg-white w-full px-4 py-2 border-b border-gray-400'>
        <h1 className='text-2xl font-bold'>Welcome to your Dashboard</h1>
      </div>
    
    </>
  )
}
import Link from 'next/link';
import { LandingPageHeader } from '@/components/landingPage'
import { LandingPageHero } from '@/components/landingPage';

export default function Home() {
  return (
    <div className='min-h-screen bg-dark'>

      <LandingPageHeader />

      <LandingPageHero />
      
    </div>
  );
}

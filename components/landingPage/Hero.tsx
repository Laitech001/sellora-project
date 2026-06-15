import Link from 'next/link';

export default function LandingPageHero() {
  return (
    <section className="w-full py-2 flex flex-col items-center justify-center rounded-lg mt-15 font-serif">

      <div>
        <p className="bg-primary-500/20 flex justify-center items-center px-4 py-1 rounded-full text-primary-500 text-sm mb-5">Multi-tenant ecommerce, built for growth</p>

        <h1 className="text-white text-center text-xl md:text-2xl lg:text-4xl">
          Run your entire business from one <br></br> dashboard
        </h1>
      </div>

      <div className="mt-10">
        <p className="text-sm text-center text-slate-400 space-y-1">Sellora gives every store owner a powerful command centre — <br></br>track sales, manage orders, control inventory, and grow with <br></br> confidence.</p>
      </div>

      <div className='mt-8 flex items-center gap-5'>
        <Link
          href={'/signup'}
          className='bg-linear-to-r from-primary-500 to-accent-500 text-white py-2 px-3 rounded-lg'
        >
          Create youre store
        </Link>

        <Link
          href={'/'}
          className='bg-card text-content border border-slate-500 py-2 px-3 rounded-lg'
        >
          See how it works
        </Link>
      </div>

      <div className='mt-5'>
        <p className='text-sm text-slate-600'>Free to start — no credit card required </p>
      </div>

    </section>
  )
}
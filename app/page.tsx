import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1>Home Page</h1>

      <Link href='/dashboard'>Go to Dashboard</Link>

      <Link href='/store/13da6ff4-7829-42a4-ba9b-87af78d3a970'>Go to Store 1</Link>
    </>
  );
}

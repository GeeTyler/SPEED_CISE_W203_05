import Link from 'next/link'
export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen m-auto">
      <h1>Home</h1>
Hello world
<Link href="/components/about">About</Link>
    </div>
  );
}

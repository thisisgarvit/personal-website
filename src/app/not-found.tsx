import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>
        This route does not exist. <Link href="/">Return to the homepage</Link>.
      </p>
    </main>
  );
}

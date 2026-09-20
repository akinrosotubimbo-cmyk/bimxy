import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-32">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-4 text-lg text-muted">That link does not lead anywhere. It may have moved.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-brand"
      >
        Go to home page
      </Link>
    </section>
  );
}
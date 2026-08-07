import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-950">Page not found</h1>
      <Link className="mt-4 inline-block font-medium text-brand-700 underline" to="/">Return home</Link>
    </section>
  )
}

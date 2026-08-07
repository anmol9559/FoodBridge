import { Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-brand-700">FoodBridge</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12"><Outlet /></main>
    </div>
  )
}

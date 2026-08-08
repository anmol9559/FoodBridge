import React from 'react'
import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full space-y-4">
        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">404 - Page Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          The requested page route could not be found or does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl transition shadow-lg shadow-emerald-500/20"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}

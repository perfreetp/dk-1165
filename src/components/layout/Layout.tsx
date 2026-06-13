import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Layout() {
  return (
    <div className="min-h-screen bg-dark">
      <Sidebar />
      
      <div className="ml-64">
        <header className="h-16 border-b border-slate-700/50 bg-dark-100/80 backdrop-blur-lg sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm text-slate-400">
              让创意激发无限可能
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-100">创意策划师</p>
              <p className="text-xs text-slate-500">v1.0.0</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              AI
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

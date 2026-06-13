import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  Sparkles, 
  Layers, 
  Image, 
  MessageSquare,
  Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: FileText, label: '创意 Brief' },
  { path: '/generate', icon: Sparkles, label: '灵感生成' },
  { path: '/pool', icon: Layers, label: '方案池' },
  { path: '/materials', icon: Image, label: '素材板' },
  { path: '/review', icon: MessageSquare, label: '评审页' },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-dark-100 border-r border-slate-700/50 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">AI 创意工厂</h1>
            <p className="text-xs text-slate-500">智能创意协作平台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-dark-200'
                }`
              }
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-slate-400">AI 引擎状态</span>
          </div>
          <p className="text-xs text-slate-300">已连接 · 准备就绪</p>
        </div>
      </div>
    </div>
  );
}

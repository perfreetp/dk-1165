import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Type, 
  Film, 
  Image, 
  Gamepad2, 
  Sparkles, 
  Heart,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateIdeas } from '../services/aiService';
import type { IdeaType, Idea } from '../types';

const ideaTypes = [
  { type: 'title' as IdeaType, icon: Type, label: '标题', color: 'from-pink-500 to-rose-500' },
  { type: 'script' as IdeaType, icon: Film, label: '脚本', color: 'from-blue-500 to-cyan-500' },
  { type: 'poster' as IdeaType, icon: Image, label: '海报文案', color: 'from-purple-500 to-violet-500' },
  { type: 'activity' as IdeaType, icon: Gamepad2, label: '活动玩法', color: 'from-green-500 to-emerald-500' },
];

const styles = ['潮流', '温情', '搞笑', '科技感', '复古', '简约', '高级感', '活泼'];

export function GeneratePage() {
  const navigate = useNavigate();
  const { currentBrief, addIdea } = useStore();
  const [selectedType, setSelectedType] = useState<IdeaType>('title');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!currentBrief) {
      alert('请先创建 Brief');
      navigate('/');
      return;
    }

    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const ideas = generateIdeas(currentBrief, selectedType, 6);
    setGeneratedIdeas(ideas);
    setIsGenerating(false);
  };

  const handleLike = (idea: Idea) => {
    if (!idea.liked) {
      addIdea({ ...idea, liked: true });
    }
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!currentBrief) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-100 mb-2">暂无 Brief</h2>
        <p className="text-slate-500 mb-6">请先创建创意 Brief</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          去创建 Brief
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">灵感生成</h1>
        <p className="text-slate-400">基于 Brief 生成多样化的创意内容</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-bold text-slate-100 mb-4">选择生成类型</h3>
            <div className="grid grid-cols-4 gap-4">
              {ideaTypes.map(item => (
                <button
                  key={item.type}
                  onClick={() => setSelectedType(item.type)}
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    selectedType === item.type
                      ? `bg-gradient-to-br ${item.color} border-transparent`
                      : 'bg-dark-200 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <item.icon className={`w-8 h-8 mx-auto mb-2 ${
                    selectedType === item.type ? 'text-white' : 'text-slate-400'
                  }`} />
                  <div className={`text-sm font-medium ${
                    selectedType === item.type ? 'text-white' : 'text-slate-400'
                  }`}>
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 className="text-lg font-bold text-slate-100 mb-4">风格筛选</h3>
            <div className="flex flex-wrap gap-2">
              {styles.map(style => (
                <button
                  key={style}
                  onClick={() => toggleStyle(style)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    selectedStyles.includes(style)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-dark-200 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
                AI 正在生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                批量生成创意
              </>
            )}
          </motion.button>

          {generatedIdeas.length > 0 && (
            <div className="space-y-4">
              {generatedIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-100 mb-1">
                        {idea.title}
                      </h4>
                      <div className="flex gap-2">
                        {idea.style.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(idea.id, idea.content)}
                        className="p-2 rounded-lg bg-dark-200 hover:bg-dark text-slate-400 hover:text-slate-100 transition-colors"
                        title="复制内容"
                      >
                        {copiedId === idea.id ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleLike(idea)}
                        className="p-2 rounded-lg bg-dark-200 hover:bg-dark text-slate-400 hover:text-primary transition-colors"
                        title="收藏到方案池"
                      >
                        <Heart className={`w-5 h-5 ${idea.liked ? 'fill-primary text-primary' : ''}`} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm whitespace-pre-line">
                    {idea.content}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card sticky top-24"
          >
            <h3 className="text-lg font-bold text-slate-100 mb-4">当前 Brief</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-slate-500 mb-1">品牌</div>
                <div className="text-slate-100 font-medium">
                  {currentBrief.brand.name || '未命名'}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">受众</div>
                <div className="text-slate-100">
                  {currentBrief.audience.ageRange}岁 · {currentBrief.audience.gender}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">渠道</div>
                <div className="flex flex-wrap gap-1">
                  {currentBrief.channels.map(channel => (
                    <span key={channel} className="px-2 py-0.5 bg-dark-200 text-slate-300 text-xs rounded">
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">主题</div>
                <div className="text-slate-100">
                  {currentBrief.constraints.requirements || '未指定'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

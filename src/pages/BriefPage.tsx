import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Target, 
  Calendar, 
  Plus, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Brief, Brand, Audience, Constraints } from '../types';

const channels = [
  '抖音', '小红书', '微博', 'B站', '微信', '快手', '知乎', '短视频'
];

const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
const genders = ['不限', '男性为主', '女性为主'];

export function BriefPage() {
  const navigate = useNavigate();
  const { briefs, addBrief, currentBrief, setCurrentBrief } = useStore();

  const [formData, setFormData] = useState<{
    brand: Brand;
    audience: Audience;
    channels: string[];
    constraints: Constraints;
  }>({
    brand: { name: '', slogan: '', tone: '' },
    audience: { ageRange: '', gender: '', interests: [] },
    channels: [],
    constraints: { budget: '', deadline: '', requirements: '' },
  });

  const handleSubmit = () => {
    const brief: Brief = {
      id: `brief-${Date.now()}`,
      ...formData,
      createdAt: Date.now(),
    };
    addBrief(brief);
    navigate('/generate');
  };

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">创意 Brief</h1>
        <p className="text-slate-400">填写项目信息，开启创意之旅</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">品牌信息</h2>
                <p className="text-sm text-slate-500">输入品牌基本信息</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  品牌名称
                </label>
                <input
                  type="text"
                  placeholder="例如：元气森林"
                  className="input-field"
                  value={formData.brand.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    brand: { ...prev.brand, name: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  品牌 Slogan
                </label>
                <input
                  type="text"
                  placeholder="例如：0糖0脂0卡"
                  className="input-field"
                  value={formData.brand.slogan}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    brand: { ...prev.brand, slogan: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  品牌调性
                </label>
                <input
                  type="text"
                  placeholder="例如：年轻、活力、健康"
                  className="input-field"
                  value={formData.brand.tone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    brand: { ...prev.brand, tone: e.target.value }
                  }))}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">受众画像</h2>
                <p className="text-sm text-slate-500">定义目标人群</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    年龄段
                  </label>
                  <select
                    className="input-field"
                    value={formData.audience.ageRange}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      audience: { ...prev.audience, ageRange: e.target.value }
                    }))}
                  >
                    <option value="">选择年龄段</option>
                    {ageRanges.map(age => (
                      <option key={age} value={age}>{age}岁</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    性别
                  </label>
                  <select
                    className="input-field"
                    value={formData.audience.gender}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      audience: { ...prev.audience, gender: e.target.value }
                    }))}
                  >
                    <option value="">选择性别</option>
                    {genders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  兴趣标签（多个用逗号分隔）
                </label>
                <input
                  type="text"
                  placeholder="例如：健身,美食,旅行"
                  className="input-field"
                  onBlur={(e) => {
                    const interests = e.target.value.split(',').map(i => i.trim()).filter(Boolean);
                    setFormData(prev => ({
                      ...prev,
                      audience: { ...prev.audience, interests }
                    }));
                  }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">投放渠道</h2>
                <p className="text-sm text-slate-500">选择推广渠道</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {channels.map(channel => (
                <button
                  key={channel}
                  onClick={() => toggleChannel(channel)}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    formData.channels.includes(channel)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-dark-200 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {channel}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">限制条件</h2>
                <p className="text-sm text-slate-500">设置项目约束</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    预算范围
                  </label>
                  <input
                    type="text"
                    placeholder="例如：10-20万"
                    className="input-field"
                    value={formData.constraints.budget}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      constraints: { ...prev.constraints, budget: e.target.value }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    时间节点
                  </label>
                  <input
                    type="text"
                    placeholder="例如：6月底前"
                    className="input-field"
                    value={formData.constraints.deadline}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      constraints: { ...prev.constraints, deadline: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  特殊要求
                </label>
                <textarea
                  placeholder="输入具体的创意方向或要求..."
                  rows={4}
                  className="input-field resize-none"
                  value={formData.constraints.requirements}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    constraints: { ...prev.constraints, requirements: e.target.value }
                  }))}
                />
              </div>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={handleSubmit}
            className="w-full btn-primary flex items-center justify-center gap-2 text-lg"
          >
            <Plus className="w-5 h-5" />
            生成创意 Brief
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card sticky top-24"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-100">历史 Brief</h3>
            </div>

            {briefs.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>暂无历史记录</p>
                <p className="text-sm mt-2">创建你的第一个 Brief</p>
              </div>
            ) : (
              <div className="space-y-3">
                {briefs.map(brief => (
                  <button
                    key={brief.id}
                    onClick={() => setCurrentBrief(brief)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      currentBrief?.id === brief.id
                        ? 'bg-primary/20 border-primary'
                        : 'bg-dark-200 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-medium text-slate-100">
                      {brief.brand.name || '未命名品牌'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(brief.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

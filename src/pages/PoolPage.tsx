import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Heart, 
  Trash2, 
  Merge,
  X,
  DollarSign,
  Tag,
  CheckSquare,
  Square,
  Send,
  Flag
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Idea, CostLevel } from '../types';

const costColors = {
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
};

const costLabels = {
  high: '高成本',
  medium: '中等成本',
  low: '低成本',
};

export function PoolPage() {
  const { 
    ideas, 
    selectedIdeas, 
    selectedForProposal,
    toggleIdeaSelection, 
    toggleIdeaForProposal,
    clearSelection,
    toggleLike,
    deleteIdea,
    updateIdeaCost,
    mergeIdeas,
    updateIdeaTags
  } = useStore();

  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [mergeTitle, setMergeTitle] = useState('');
  const [mergeContent, setMergeContent] = useState('');
  const [filterCost, setFilterCost] = useState<CostLevel | 'all'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [editingTags, setEditingTags] = useState<{ id: string; tags: string[] } | null>(null);

  const likedIdeas = ideas.filter(idea => idea.liked);

  const filteredIdeas = likedIdeas.filter(idea => {
    if (filterCost !== 'all' && idea.cost !== filterCost) return false;
    if (filterType !== 'all' && idea.type !== filterType) return false;
    return true;
  });

  const handleMerge = () => {
    if (selectedIdeas.length >= 2) {
      const selected = ideas.filter(i => selectedIdeas.includes(i.id));
      setMergeTitle(`${selected.length}个方案合并`);
      setMergeContent(selected.map(i => `【${i.title}】\n${i.content}`).join('\n\n---\n\n'));
      setIsMergeModalOpen(true);
    }
  };

  const confirmMerge = () => {
    if (mergeTitle && mergeContent) {
      mergeIdeas(selectedIdeas, mergeTitle, mergeContent);
      setIsMergeModalOpen(false);
      setMergeTitle('');
      setMergeContent('');
    }
  };

  const handleCostChange = (ideaId: string, cost: CostLevel) => {
    updateIdeaCost(ideaId, cost);
  };

  const handleEditTags = (idea: Idea) => {
    setEditingTags({ id: idea.id, tags: [...idea.tags] });
  };

  const handleSaveTags = () => {
    if (editingTags) {
      updateIdeaTags(editingTags.id, editingTags.tags);
      setEditingTags(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">方案池</h1>
        <p className="text-slate-400">管理已收藏的创意方案</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-bold text-slate-100">筛选条件</h3>
              </div>
              <div className="flex gap-2">
                {selectedIdeas.length > 0 && (
                  <button
                    onClick={handleMerge}
                    disabled={selectedIdeas.length < 2}
                    className="px-4 py-2 bg-primary/20 text-primary rounded-lg border border-primary/30 hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Merge className="w-4 h-4" />
                    合并 ({selectedIdeas.length})
                  </button>
                )}
                {selectedIdeas.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 bg-dark-200 text-slate-400 rounded-lg hover:bg-dark hover:text-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={filterCost}
                onChange={(e) => setFilterCost(e.target.value as CostLevel | 'all')}
                className="input-field flex-1"
              >
                <option value="all">全部成本</option>
                <option value="high">高成本</option>
                <option value="medium">中等成本</option>
                <option value="low">低成本</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field flex-1"
              >
                <option value="all">全部类型</option>
                <option value="title">标题</option>
                <option value="script">脚本</option>
                <option value="poster">海报文案</option>
                <option value="activity">活动玩法</option>
              </select>
            </div>
          </motion.div>

          {filteredIdeas.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-xl text-slate-400 mb-2">暂无收藏的方案</p>
              <p className="text-sm text-slate-500">去灵感生成页收藏喜欢的创意吧</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIdeas.map((idea, index) => {
                const isSelected = selectedIdeas.includes(idea.id);
                const isForProposal = selectedForProposal.includes(idea.id);
                
                return (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`card group ${
                      isForProposal ? 'ring-2 ring-green-500/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleIdeaSelection(idea.id)}
                        className="mt-1 text-slate-500 hover:text-primary transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-primary" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-bold text-slate-100">
                                {idea.title}
                              </h4>
                              {isForProposal && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded flex items-center gap-1">
                                  <Flag className="w-3 h-3" />
                                  入选提案
                                </span>
                              )}
                              {idea.tags.includes('merged') && (
                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                                  合并方案
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className={`px-2 py-1 text-xs rounded border ${costColors[idea.cost]}`}>
                                <DollarSign className="w-3 h-3 inline mr-1" />
                                {costLabels[idea.cost]}
                              </span>
                              {idea.style.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-dark-200 text-slate-400 text-xs rounded flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleIdeaForProposal(idea.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                isForProposal 
                                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' 
                                  : 'bg-dark-200 hover:bg-dark text-slate-400 hover:text-green-400'
                              }`}
                              title={isForProposal ? "取消入选" : "标记入选提案"}
                            >
                              <Flag className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditTags(idea)}
                              className="p-2 rounded-lg bg-dark-200 hover:bg-dark text-slate-400 hover:text-slate-100 transition-colors"
                              title="编辑标签"
                            >
                              <Tag className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleLike(idea.id)}
                              className="p-2 rounded-lg bg-dark-200 hover:bg-dark text-slate-400 hover:text-red-400 transition-colors"
                              title="取消收藏"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                            <button
                              onClick={() => deleteIdea(idea.id)}
                              className="p-2 rounded-lg bg-dark-200 hover:bg-dark text-slate-400 hover:text-red-400 transition-colors"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-slate-400 text-sm whitespace-pre-line">
                          {idea.content}
                        </p>

                        <div className="flex gap-2 mt-4">
                          {(['low', 'medium', 'high'] as CostLevel[]).map(cost => (
                            <button
                              key={cost}
                              onClick={() => handleCostChange(idea.id, cost)}
                              className={`px-3 py-1 text-xs rounded border transition-all ${
                                idea.cost === cost
                                  ? costColors[cost]
                                  : 'bg-dark-200 border-slate-700 text-slate-500 hover:border-slate-600'
                              }`}
                            >
                              {costLabels[cost]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-100">统计信息</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">总方案数</span>
                <span className="text-2xl font-bold gradient-text">{likedIdeas.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">已选中</span>
                <span className="text-xl font-bold text-primary">{selectedIdeas.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">入选提案</span>
                <span className="text-xl font-bold text-green-400">{selectedForProposal.length}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flag className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-slate-100">提案入选</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              点击方案卡片上的 <Flag className="w-4 h-4 inline text-green-400" /> 按钮将其标记为入选方案
            </p>
            <p className="text-sm text-slate-500">
              入选方案将用于生成提案大纲
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isMergeModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMergeModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-dark-100 rounded-2xl border border-slate-700 p-8 max-w-2xl w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-100">合并方案</h3>
                  <button
                    onClick={() => setIsMergeModalOpen(false)}
                    className="text-slate-400 hover:text-slate-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      方案标题
                    </label>
                    <input
                      type="text"
                      value={mergeTitle}
                      onChange={(e) => setMergeTitle(e.target.value)}
                      className="input-field"
                      placeholder="输入合并后的方案标题"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      方案内容
                    </label>
                    <textarea
                      value={mergeContent}
                      onChange={(e) => setMergeContent(e.target.value)}
                      rows={10}
                      className="input-field resize-none"
                      placeholder="编辑合并后的方案内容"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsMergeModalOpen(false)}
                      className="flex-1 btn-secondary"
                    >
                      取消
                    </button>
                    <button
                      onClick={confirmMerge}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <Merge className="w-5 h-5" />
                      确认合并（保留在方案池）
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingTags && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTags(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-dark-100 rounded-2xl border border-slate-700 p-8 max-w-md w-full">
                <h3 className="text-xl font-bold text-slate-100 mb-4">编辑标签</h3>
                <input
                  type="text"
                  value={editingTags.tags.join(', ')}
                  onChange={(e) => setEditingTags({
                    ...editingTags,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  className="input-field mb-4"
                  placeholder="输入标签，用逗号分隔"
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setEditingTags(null)}
                    className="flex-1 btn-secondary"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveTags}
                    className="flex-1 btn-primary"
                  >
                    保存
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

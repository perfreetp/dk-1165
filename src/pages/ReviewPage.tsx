import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Star, 
  Send,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Plus,
  X,
  UserPlus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateStoryboard } from '../services/aiService';
import type { Idea, Review, ReviewScores, Proposal, Comment } from '../types';

export function ReviewPage() {
  const { 
    ideas, 
    reviews, 
    proposals, 
    colleagues,
    selectedForProposal,
    addReview, 
    addProposal,
    addColleague,
    removeColleague
  } = useStore();

  const likedIdeas = ideas.filter(idea => idea.liked);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [reviewerName, setReviewerName] = useState('');
  const [scores, setScores] = useState<ReviewScores>({
    creativity: 0,
    feasibility: 0,
    alignment: 0,
  });
  const [comment, setComment] = useState('');
  const [showStoryboard, setShowStoryboard] = useState(false);
  const [proposalName, setProposalName] = useState('');
  const [isAddingColleague, setIsAddingColleague] = useState(false);
  const [newColleagueName, setNewColleagueName] = useState('');
  const [assignModal, setAssignModal] = useState<{ ideaId: string; ideaTitle: string } | null>(null);
  const [selectedColleagues, setSelectedColleagues] = useState<string[]>([]);

  const handleSubmitReview = () => {
    if (!selectedIdea || !reviewerName) return;

    const review: Review = {
      id: `review-${Date.now()}`,
      ideaId: selectedIdea.id,
      reviewer: reviewerName,
      scores,
      comments: comment.trim() ? [{
        id: `comment-${Date.now()}`,
        author: reviewerName,
        content: comment,
        createdAt: Date.now(),
      }] : [],
      status: 'pending',
      createdAt: Date.now(),
    };

    addReview(review);
    setComment('');
    setReviewerName('');
    setScores({ creativity: 0, feasibility: 0, alignment: 0 });
  };

  const handleAddColleague = () => {
    if (newColleagueName.trim()) {
      addColleague(newColleagueName.trim());
      setNewColleagueName('');
      setIsAddingColleague(false);
    }
  };

  const handleAssignToColleagues = () => {
    if (!assignModal || selectedColleagues.length === 0) return;
    
    selectedColleagues.forEach(colleague => {
      const review: Review = {
        id: `review-${Date.now()}-${colleague}`,
        ideaId: assignModal.ideaId,
        reviewer: colleague,
        scores: { creativity: 0, feasibility: 0, alignment: 0 },
        comments: [],
        status: 'pending',
        createdAt: Date.now(),
      };
      addReview(review);
    });
    
    setAssignModal(null);
    setSelectedColleagues([]);
  };

  const handleGenerateProposal = () => {
    if (!proposalName.trim()) return;

    const selectedIdeasList = ideas.filter(idea => selectedForProposal.includes(idea.id));
    
    if (selectedIdeasList.length === 0) {
      alert('请先在方案池中选择入选方案');
      return;
    }

    const proposal: Proposal = {
      id: `proposal-${Date.now()}`,
      name: proposalName,
      ideaIds: selectedForProposal,
      outline: generateProposalOutline(selectedIdeasList),
      status: 'draft',
      createdAt: Date.now(),
    };

    addProposal(proposal);
    setProposalName('');
  };

  const generateProposalOutline = (selectedIdeas: Idea[]): string => {
    const outline = `# 创意提案大纲

## 项目概述
整合 ${selectedIdeas.length} 个入选创意方案

---

## 创意方案

${selectedIdeas.map((idea, index) => `
### ${index + 1}. ${idea.title}

**类型**: ${idea.type === 'title' ? '标题' : idea.type === 'script' ? '脚本' : idea.type === 'poster' ? '海报文案' : '活动玩法'}
**成本评估**: ${idea.cost === 'high' ? '高' : idea.cost === 'medium' ? '中' : '低'}
**风格**: ${idea.style.join(', ')}
**标签**: ${idea.tags.join(', ')}

#### 详细内容
${idea.content}

---

`).join('')}

## 核心亮点

${selectedIdeas.slice(0, 3).map((idea, index) => `
${index + 1}. **${idea.title}** - ${idea.content.split('\n')[0]}
`).join('\n')}

---

## 下一步行动

1. 确定最终方案
2. 制定执行计划
3. 分配资源
4. 设定时间节点

---

**提案生成时间**: ${new Date().toLocaleString('zh-CN')}
`;

    return outline;
  };

  const handleExportProposal = () => {
    if (proposals.length === 0) return;

    const latestProposal = proposals[0];
    const blob = new Blob([latestProposal.outline], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${latestProposal.name}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getIdeaReviews = (ideaId: string) => {
    return reviews.filter(r => r.ideaId === ideaId);
  };

  const getPendingReviews = () => {
    return reviews.filter(r => r.status === 'pending' && r.scores.creativity === 0);
  };

  const averageScore = (ideaId: string) => {
    const ideaReviews = getIdeaReviews(ideaId).filter(r => r.scores.creativity > 0);
    if (ideaReviews.length === 0) return null;

    const total = ideaReviews.reduce((acc, review) => {
      return acc + (review.scores.creativity + review.scores.feasibility + review.scores.alignment) / 3;
    }, 0);

    return (total / ideaReviews.length).toFixed(1);
  };

  const allReviewComments = (ideaId: string): Comment[] => {
    const ideaReviews = getIdeaReviews(ideaId);
    return ideaReviews.flatMap(r => r.comments).sort((a, b) => b.createdAt - a.createdAt);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">评审页</h1>
        <p className="text-slate-400">团队评分与提案生成</p>
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
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-slate-100">待评审方案</h2>
              </div>
              <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                {likedIdeas.length} 个方案
              </span>
            </div>

            {likedIdeas.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>暂无待评审的方案</p>
                <p className="text-sm mt-2">去方案池选择要评审的方案</p>
              </div>
            ) : (
              <div className="space-y-3">
                {likedIdeas.map(idea => {
                  const avgScore = averageScore(idea.id);
                  const ideaReviews = getIdeaReviews(idea.id);
                  const pendingReviews = ideaReviews.filter(r => r.status === 'pending' && r.scores.creativity === 0);
                  
                  return (
                    <div
                      key={idea.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedIdea?.id === idea.id
                          ? 'bg-primary/20 border-primary'
                          : 'bg-dark-200 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setSelectedIdea(idea)}
                        >
                          <h4 className="font-medium text-slate-100 mb-1">
                            {idea.title}
                          </h4>
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {idea.content.substring(0, 80)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {avgScore ? (
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-5 h-5 fill-current" />
                              <span className="font-bold">{avgScore}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">待评审</span>
                          )}
                          {pendingReviews.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setAssignModal({ ideaId: idea.id, ideaTitle: idea.title });
                                setSelectedColleagues(pendingReviews.map(r => r.reviewer));
                              }}
                              className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded flex items-center gap-1"
                            >
                              <Clock className="w-3 h-3" />
                              {pendingReviews.length}人待评
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssignModal({ ideaId: idea.id, ideaTitle: idea.title });
                            }}
                            className="ml-2 p-1 bg-dark hover:bg-dark-100 rounded text-slate-400 hover:text-primary transition-colors"
                            title="分配评审"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {allReviewComments(idea.id).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-700">
                          <p className="text-xs text-slate-500">
                            {allReviewComments(idea.id).length} 条评论
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {selectedIdea && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-100 mb-2">
                  {selectedIdea.title}
                </h3>
                <p className="text-slate-400 text-sm whitespace-pre-line">
                  {selectedIdea.content}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    评审人姓名
                  </label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="输入你的名字"
                    className="input-field"
                  />
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'creativity' as const, label: '创意性', icon: '💡' },
                    { key: 'feasibility' as const, label: '可行性', icon: '⚙️' },
                    { key: 'alignment' as const, label: '契合度', icon: '🎯' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {label}
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(score => (
                          <button
                            key={score}
                            onClick={() => setScores(prev => ({ ...prev, [key]: score }))}
                            className={`flex-1 py-2 rounded-lg border transition-all ${
                              scores[key] >= score
                                ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                                : 'bg-dark-200 border-slate-700 text-slate-500 hover:border-slate-600'
                            }`}
                          >
                            <Star className={`w-5 h-5 mx-auto ${scores[key] >= score ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    评论
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="写下你的评审意见..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewerName || scores.creativity === 0}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  提交评审
                </button>
              </div>

              {getIdeaReviews(selectedIdea.id).length > 0 && (
                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">
                    评审记录 ({getIdeaReviews(selectedIdea.id).filter(r => r.scores.creativity > 0).length})
                  </h4>
                  <div className="space-y-3">
                    {getIdeaReviews(selectedIdea.id)
                      .filter(r => r.scores.creativity > 0)
                      .map(review => (
                        <div key={review.id} className="bg-dark-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-100">{review.reviewer}</span>
                            <div className="flex gap-1 text-yellow-400">
                              {[1, 2, 3, 4, 5].map(star => {
                                const avg = Math.round((review.scores.creativity + review.scores.feasibility + review.scores.alignment) / 3);
                                return (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${avg >= star ? 'fill-current' : ''}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          {review.comments.map(c => (
                            <p key={c.id} className="text-sm text-slate-400">{c.content}</p>
                          ))}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setShowStoryboard(!showStoryboard)}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  {showStoryboard ? '隐藏' : '生成'}分镜草稿
                </button>

                {showStoryboard && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-dark-200 rounded-lg"
                  >
                    <h4 className="text-sm font-medium text-slate-300 mb-3">分镜草稿</h4>
                    <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono">
                      {generateStoryboard(selectedIdea)}
                    </pre>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card sticky top-24"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-slate-100">同事管理</h3>
              </div>
              <button
                onClick={() => setIsAddingColleague(true)}
                className="p-1 rounded hover:bg-dark-200 text-slate-400 hover:text-primary transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {isAddingColleague && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newColleagueName}
                  onChange={(e) => setNewColleagueName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddColleague()}
                  placeholder="输入同事姓名"
                  className="input-field flex-1"
                  autoFocus
                />
                <button
                  onClick={handleAddColleague}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {colleagues.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  暂无同事，请添加
                </p>
              ) : (
                colleagues.map(name => {
                  const pendingCount = reviews.filter(
                    r => r.reviewer === name && r.status === 'pending' && r.scores.creativity === 0
                  ).length;
                  
                  return (
                    <div
                      key={name}
                      className="flex items-center justify-between p-2 bg-dark-200 rounded-lg group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-slate-300">{name}</span>
                        {pendingCount > 0 && (
                          <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                            待评 {pendingCount}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeColleague(name)}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-slate-100">提案生成</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  提案名称
                </label>
                <input
                  type="text"
                  value={proposalName}
                  onChange={(e) => setProposalName(e.target.value)}
                  placeholder="输入提案名称"
                  className="input-field"
                />
              </div>

              <div className="p-3 bg-dark-200 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">入选方案数</span>
                  <span className="text-green-400 font-bold">{selectedForProposal.length}</span>
                </div>
              </div>

              <button
                onClick={handleGenerateProposal}
                disabled={!proposalName.trim() || selectedForProposal.length === 0}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                生成提案大纲
              </button>

              {proposals.length > 0 && (
                <button
                  onClick={handleExportProposal}
                  className="w-full btn-secondary flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  导出最新提案
                </button>
              )}

              {proposals.length > 0 && (
                <div className="border-t border-slate-700 pt-4">
                  <div className="space-y-2">
                    {proposals.map(proposal => (
                      <div key={proposal.id} className="bg-dark-200 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-slate-100 text-sm">
                              {proposal.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              包含 {proposal.ideaIds.length} 个方案
                            </p>
                          </div>
                          {proposal.status === 'draft' ? (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                              <Clock className="w-3 h-3 inline mr-1" />
                              草稿
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              完成
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {assignModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssignModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-dark-100 rounded-2xl border border-slate-700 p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-100">分配评审</h3>
                  <button
                    onClick={() => setAssignModal(null)}
                    className="text-slate-400 hover:text-slate-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-sm text-slate-400 mb-4">
                  为「{assignModal.ideaTitle}」分配评审人
                </p>

                <div className="space-y-2 mb-6">
                  {colleagues.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      请先添加同事
                    </p>
                  ) : (
                    colleagues.map(name => (
                      <button
                        key={name}
                        onClick={() => {
                          setSelectedColleagues(prev =>
                            prev.includes(name)
                              ? prev.filter(n => n !== name)
                              : [...prev, name]
                          );
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          selectedColleagues.includes(name)
                            ? 'bg-primary/20 border-primary'
                            : 'bg-dark-200 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedColleagues.includes(name)
                            ? 'border-primary bg-primary'
                            : 'border-slate-600'
                        }`}>
                          {selectedColleagues.includes(name) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-100">{name}</span>
                      </button>
                    ))
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setAssignModal(null)}
                    className="flex-1 btn-secondary"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAssignToColleagues}
                    disabled={selectedColleagues.length === 0}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <UserPlus className="w-5 h-5" />
                    确认分配 ({selectedColleagues.length})
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

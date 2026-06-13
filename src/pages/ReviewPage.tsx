import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Star, 
  Send,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateStoryboard } from '../services/aiService';
import type { Idea, Review, ReviewScores, Proposal } from '../types';

export function ReviewPage() {
  const { ideas, reviews, proposals, addReview, addProposal } = useStore();
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

  const handleGenerateProposal = () => {
    if (!proposalName.trim() || likedIdeas.length === 0) return;

    const proposal: Proposal = {
      id: `proposal-${Date.now()}`,
      name: proposalName,
      ideaIds: likedIdeas.map(i => i.id),
      outline: generateProposalOutline(likedIdeas),
      status: 'draft',
      createdAt: Date.now(),
    };

    addProposal(proposal);
    setProposalName('');
  };

  const generateProposalOutline = (ideas: Idea[]): string => {
    const outline = `# 创意提案大纲

## 项目概述
基于Brief要求，整合 ${ideas.length} 个创意方案

---

## 创意方案

${ideas.map((idea, index) => `
### ${index + 1}. ${idea.title}

**类型**: ${idea.type === 'title' ? '标题' : idea.type === 'script' ? '脚本' : idea.type === 'poster' ? '海报文案' : '活动玩法'}
**成本评估**: ${idea.cost === 'high' ? '高' : idea.cost === 'medium' ? '中' : '低'}
**风格**: ${idea.style.join(', ')}

#### 详细内容
${idea.content}

---

`).join('')}

## 核心亮点

${ideas.slice(0, 3).map((idea, index) => `
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

  const averageScore = (ideaId: string) => {
    const ideaReviews = getIdeaReviews(ideaId);
    if (ideaReviews.length === 0) return null;

    const total = ideaReviews.reduce((acc, review) => {
      return acc + (review.scores.creativity + review.scores.feasibility + review.scores.alignment) / 3;
    }, 0);

    return (total / ideaReviews.length).toFixed(1);
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
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-slate-100">选择方案进行评审</h2>
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
                  return (
                    <button
                      key={idea.id}
                      onClick={() => setSelectedIdea(idea)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedIdea?.id === idea.id
                          ? 'bg-primary/20 border-primary'
                          : 'bg-dark-200 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-100 mb-1">
                            {idea.title}
                          </h4>
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {idea.content.substring(0, 100)}...
                          </p>
                        </div>
                        {avgScore && (
                          <div className="flex items-center gap-1 text-yellow-400 ml-4">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-bold">{avgScore}</span>
                          </div>
                        )}
                      </div>
                    </button>
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
                  ].map(({ key, label, icon }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {icon} {label}
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
                    历史评审 ({getIdeaReviews(selectedIdea.id).length})
                  </h4>
                  <div className="space-y-3">
                    {getIdeaReviews(selectedIdea.id).map(review => (
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

              <button
                onClick={handleGenerateProposal}
                disabled={!proposalName.trim() || likedIdeas.length === 0}
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

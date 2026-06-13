import type { IdeaType, Idea, Brief } from '../types';

const titleTemplates = [
  "震撼发布 | {brand}开启{topic}新时代",
  "🔥 {brand}这波操作绝了！{topic}引爆全网",
  "必看！{brand}竟然这样玩{topic}",
  "{brand}×{topic}：这才是真正的跨界合作",
  "绝了！{brand}的{topic}让所有人眼前一亮",
  "错过等一年！{brand}{topic}限时开启",
  "疯抢ing！{brand}{topic}到底有多香？",
  "{brand}全新{topic}，你准备好被种草了吗？",
];

const scriptTemplates = {
  title: [
    "开场：展示{brand}产品独特卖点（3秒）\n主体：演示{topic}核心功能，1-2个使用场景（15秒）\n高潮：用户评价或KOL背书（5秒）\n结尾：引导点击和关注（2秒）",
    "悬念开场：提出{topic}相关问题（3秒）\n引入：通过生活场景引出{brand}（5秒）\n展示：详细演示产品功能（15秒）\n号召：鼓励评论和分享（2秒）",
  ],
  script: [
    "镜头1：清晨，主人公使用{brand}产品开始新的一天\n镜头2：工作中，展现{topic}如何提升效率\n镜头3：下班后，展示生活品质的提升\n旁白：{brand}，让{topic}成为可能",
    "开场：震撼的视觉效果展示{topic}\n转折：主人公遇到问题\n解决方案：使用{brand}产品\n结尾：完美解决问题，生活更美好",
  ],
  poster: [
    "主视觉：{brand}品牌Logo + {topic}核心元素\n文案：醒目的标题 + 简短有力的slogan\n底部：活动时间/参与方式\n整体风格：{style}",
    "大图展示{topic}场景\n小字标注{brand}\n渐变背景营造氛围\nCTA按钮：立即参与",
  ],
  activity: [
    "线上活动：{brand}发起{topic}挑战赛\n参与方式：拍摄{topic}相关视频\n奖励机制：优秀作品获得{brand}大礼包\n传播路径：UGC裂变",
    "互动活动：{topic}话题讨论\n形式：{brand}官方发布话题\n激励机制：精选评论获得专属礼品\n二次传播：优质内容官方转发",
  ],
};

const styleTemplates: Record<string, string[]> = {
  '潮流': [
    "采用撞色设计和动态效果，视觉冲击力强，符合年轻群体审美",
    "融入街头文化和时尚元素，展现独特个性",
    "使用渐变色彩和现代排版，引领潮流趋势",
  ],
  '温情': [
    "以情感故事为切入点，触动用户内心",
    "营造家庭氛围和人文关怀，传递温暖",
    "采用柔和色调和慢节奏叙事，引发共鸣",
  ],
  '搞笑': [
    "设置反转和意外情节，制造惊喜效果",
    "运用幽默对白和夸张表演，引人发笑",
    "结合网络热点和梗文化，增加趣味性",
  ],
  '科技感': [
    "使用蓝光霓虹和几何线条，展现科技美学",
    "采用3D建模和粒子效果，突出未来感",
    "结合AI和数据可视化，增强专业度",
  ],
  '复古': [
    "运用胶片滤镜和老式字体，唤起怀旧感",
    "融合80年代霓虹风格，复刻经典",
    "采用 VHS 录像带效果，增加年代感",
  ],
  '简约': [
    "采用大面积留白和极简设计，突出核心信息",
    "使用单一色系和简洁图形，传达品牌调性",
    "追求less is more理念，提升品质感",
  ],
  '高级感': [
    "运用黑白灰配色和精致排版，彰显品质",
    "采用奢侈品广告风格，传递高端定位",
    "注重细节和质感，提升品牌调性",
  ],
  '活泼': [
    "使用明快色彩和跳动元素，充满活力",
    "采用可爱插画和趣味互动，吸引注意",
    "结合轻松音乐和欢快节奏，营造愉悦氛围",
  ],
};

const allStyles = ['潮流', '温情', '搞笑', '科技感', '复古', '简约', '高级感', '活泼'];

export function generateIdeas(
  brief: Brief, 
  type: IdeaType, 
  count: number = 5,
  selectedStyles: string[] = []
): Idea[] {
  const ideas: Idea[] = [];
  const { brand, audience, constraints } = brief;
  
  const stylesToUse = selectedStyles.length > 0 ? selectedStyles : allStyles;

  for (let i = 0; i < count; i++) {
    const templates = type === 'title' || type === 'poster' 
      ? scriptTemplates[type] 
      : scriptTemplates[type] || scriptTemplates.script;

    const template = templates[Math.floor(Math.random() * templates.length)];
    
    const currentStyle = stylesToUse[Math.floor(Math.random() * stylesToUse.length)];
    const styleDesc = styleTemplates[currentStyle]?.[Math.floor(Math.random() * 3)] || '';
    
    const content = template
      .replace(/{brand}/g, brand.name || '品牌')
      .replace(/{topic}/g, constraints.requirements || '创意主题')
      .replace(/{style}/g, currentStyle) + 
      (styleDesc ? `\n\n风格说明：${styleDesc}` : '');

    const title = type === 'title' 
      ? titleTemplates[Math.floor(Math.random() * titleTemplates.length)]
          .replace(/{brand}/g, brand.name || '品牌')
          .replace(/{topic}/g, constraints.requirements || '创意主题')
      : `${type === 'script' ? '短视频脚本' : type === 'poster' ? '海报设计' : '活动方案'} #${i + 1}`;

    const idea: Idea = {
      id: `idea-${Date.now()}-${i}`,
      briefId: brief.id,
      type,
      title,
      content,
      style: [currentStyle],
      cost: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
      tags: [type, audience.ageRange, brand.tone].filter(Boolean),
      liked: false,
      createdAt: Date.now(),
    };

    ideas.push(idea);
  }

  return ideas;
}

export function generateStoryboard(idea: Idea): string {
  const scenes = [
    {
      scene: 1,
      duration: '3秒',
      content: '开场镜头，展示整体氛围',
      description: '使用广角镜头，营造视觉冲击力'
    },
    {
      scene: 2,
      duration: '5秒',
      content: '产品特写，突出卖点',
      description: '近距离拍摄，展示产品细节'
    },
    {
      scene: 3,
      duration: '8秒',
      content: '使用场景演示',
      description: '结合目标受众的真实使用场景'
    },
    {
      scene: 4,
      duration: '4秒',
      content: '高潮部分',
      description: '最精彩的瞬间，抓住用户注意力'
    },
    {
      scene: 5,
      duration: '3秒',
      content: '结尾呼起',
      description: '品牌logo + CTA'
    },
  ];

  return scenes.map(s => `场景${s.scene} | ${s.duration}\n${s.content}\n${s.description}`).join('\n\n');
}

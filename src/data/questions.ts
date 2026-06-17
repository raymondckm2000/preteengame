import type { Question } from '../types/game'

export const questions: Question[] = [
  { id: 'action-001', categoryId: 'action', text: '扮一隻正在追自己尾巴的狗', sortOrder: 1, enabled: true },
  { id: 'action-002', categoryId: 'action', text: '扮一個剛剛跳到積木上的人', sortOrder: 2, enabled: true },
  { id: 'action-003', categoryId: 'action', text: '不出聲扮演正在打籃球', sortOrder: 3, enabled: true },
  { id: 'action-004', categoryId: 'action', text: '扮一個很怕冷的人', sortOrder: 4, enabled: true },
  { id: 'action-005', categoryId: 'action', text: '扮演超級英雄降落地面', sortOrder: 5, enabled: true },
  { id: 'action-006', categoryId: 'action', text: '用動作表演正在乘坐過山車', sortOrder: 6, enabled: true },

  { id: 'english-001', categoryId: 'english', text: '用英文講出五種食物', sortOrder: 1, enabled: true },
  { id: 'english-002', categoryId: 'english', text: '用英文介紹自己三句', sortOrder: 2, enabled: true },
  { id: 'english-003', categoryId: 'english', text: '用英文講出四種動物', sortOrder: 3, enabled: true },
  { id: 'english-004', categoryId: 'english', text: '用英文形容你今日的心情', sortOrder: 4, enabled: true },
  { id: 'english-005', categoryId: 'english', text: '用英文講出三樣課室會見到的物件', sortOrder: 5, enabled: true },
  { id: 'english-006', categoryId: 'english', text: '用英文說出你最喜歡的遊戲及原因', sortOrder: 6, enabled: true },

  { id: 'mandarin-001', categoryId: 'mandarin', text: '用國語介紹自己三句', sortOrder: 1, enabled: true },
  { id: 'mandarin-002', categoryId: 'mandarin', text: '用國語講出五種水果', sortOrder: 2, enabled: true },
  { id: 'mandarin-003', categoryId: 'mandarin', text: '用國語形容今天的天氣', sortOrder: 3, enabled: true },
  { id: 'mandarin-004', categoryId: 'mandarin', text: '用國語講出三樣你喜歡做的事情', sortOrder: 4, enabled: true },
  { id: 'mandarin-005', categoryId: 'mandarin', text: '用國語說出四種動物', sortOrder: 5, enabled: true },
  { id: 'mandarin-006', categoryId: 'mandarin', text: '用國語分享你最喜歡的食物', sortOrder: 6, enabled: true },

  { id: 'cantonese-001', categoryId: 'cantonese', text: '用廣東話講一個你最近最開心的時刻', sortOrder: 1, enabled: true },
  { id: 'cantonese-002', categoryId: 'cantonese', text: '用三個詞語形容自己', sortOrder: 2, enabled: true },
  { id: 'cantonese-003', categoryId: 'cantonese', text: '講出五樣返學要帶的物品', sortOrder: 3, enabled: true },
  { id: 'cantonese-004', categoryId: 'cantonese', text: '分享一樣你最想學懂的技能', sortOrder: 4, enabled: true },
  { id: 'cantonese-005', categoryId: 'cantonese', text: '講出三樣你認為好朋友應有的特質', sortOrder: 5, enabled: true },
  { id: 'cantonese-006', categoryId: 'cantonese', text: '用一句說話介紹你最喜歡的興趣', sortOrder: 6, enabled: true },

  { id: 'teamwork-001', categoryId: 'teamwork', text: '二人背靠背坐下，再一起站起來', sortOrder: 1, enabled: true },
  { id: 'teamwork-002', categoryId: 'teamwork', text: '二人不用說話，合作擺出一個心形以外的圖案', sortOrder: 2, enabled: true },
  { id: 'teamwork-003', categoryId: 'teamwork', text: '二人輪流講數字，由 1 數到 20，不能同時開口', sortOrder: 3, enabled: true },
  { id: 'teamwork-004', categoryId: 'teamwork', text: '一人做動作，另一人像鏡子一樣同步模仿', sortOrder: 4, enabled: true },
  { id: 'teamwork-005', categoryId: 'teamwork', text: '二人只用一隻手合作把一件物件移到指定位置', sortOrder: 5, enabled: true },
  { id: 'teamwork-006', categoryId: 'teamwork', text: '二人一起擺出一個超級英雄團隊姿勢', sortOrder: 6, enabled: true },
]

export const enabledQuestions = questions
  .filter((question) => question.enabled)
  .sort((questionA, questionB) => questionA.sortOrder - questionB.sortOrder)

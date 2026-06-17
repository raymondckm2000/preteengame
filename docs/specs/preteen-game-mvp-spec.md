# Preteen 分類挑戰遊戲 — MVP 開發規格

## 1. 文件目的

本文件供 Codex 開發第一版 MVP 使用。

本階段只完成可實際遊玩的前端版本，不建立 Supabase、不建立雲端資料庫、不處理多裝置同步。

所有分類及題目先直接儲存在程式內的本地資料檔案中。待 MVP 遊戲流程完成並測試通過後，才進入後台及 Supabase 開發階段。

---

## 2. MVP 開發目標

建立一個適合 Preteen、主要在平板橫向使用的分類挑戰遊戲網站。

基本流程：

1. 開啟網站
2. 首頁只顯示「新遊戲」
3. 按下「新遊戲」後進入分類主頁
4. 玩家選擇分類
5. 系統從該分類隨機抽出一條未出現過的題目
6. 題目先顯示，玩家按「開始」後才開始 60 秒倒數
7. 遊戲期間可暫停、繼續、完成、跳過或返回分類
8. 同一局遊戲內，任何已出現題目均不可再次出現
9. 題目完成、跳過或返回分類後，該題均視為已出題
10. 當一個分類題目全部用完，該分類按鈕變灰並不可再按
11. 當所有分類題目全部用完，顯示「本局遊戲已完成」及「開始新遊戲」

---

## 3. 本階段不包括的功能

以下功能不應在 MVP 階段開發：

- Supabase
- 雲端資料庫
- 多裝置同步
- 管理後台
- 管理密碼
- 分類新增、修改、刪除
- 題目新增、修改、刪除
- 題目批量匯入
- CSV／Excel 匯入或匯出
- 使用者登入
- 隊伍系統
- 計分系統
- 遊戲歷史紀錄
- 音效
- 背景音樂
- 分析追蹤

程式架構應保留日後接駁 API 或 Supabase 的可能性，但不得為未來功能過度設計。

---

## 4. 建議技術

- React
- TypeScript
- Vite
- React Router
- CSS Modules、普通 CSS 或 Tailwind CSS 均可
- localStorage 或 sessionStorage 儲存本局遊戲狀態
- 建議使用 PWA plugin 建立基本離線能力

推薦套件：

- `react-router-dom`
- `vite-plugin-pwa`
- 圖示可用 `lucide-react`

不得因為動畫或 UI 套件增加不必要複雜度。

---

## 5. 主要使用環境

- 主要裝置：平板
- 主要方向：橫向模式
- 介面語言：繁體中文
- 操作方式：觸控
- 使用者：Preteen，約 12–15 歲
- 操作者可能是導師或學生

介面必須：

- 按鈕夠大
- 字體清晰
- 避免過多文字
- 不依賴 hover 才能操作
- 最低支援常見平板瀏覽器

---

## 6. 頁面與路由

建議路由：

```text
/                 首頁
/game             分類主頁
/game/question    題目頁
/game/complete    全部題目完成頁
```

未知路由應導回首頁。

---

## 7. 首頁規格

### 顯示內容

首頁只顯示：

- 一個大型「新遊戲」按鈕

不顯示：

- 遊戲名稱
- 玩法說明
- 管理後台入口
- 返回按鈕
- 其他設定

### 新遊戲按鈕行為

按下後：

1. 立即清除上一局所有遊戲狀態
2. 清除已出題 ID
3. 清除目前題目
4. 清除倒數狀態
5. 進入分類主頁

不需要確認視窗。

---

## 8. 分類主頁規格

### 標題

畫面上方顯示：

```text
選擇下一個挑戰
```

### 分類排列

預設五個分類時：

- 第一行三個
- 第二行兩個
- 大型卡片按鈕
- 五個分類使用不同顏色及預設圖示

如日後分類數量增加：

- 自動排列成整齊網格
- 可上下滑動

### 預設分類

1. 動作
2. 英文
3. 國語
4. 廣東話
5. 二人合作

### 分類狀態

正常分類：

- 顯示分類名稱
- 顯示分類圖示
- 使用分類顏色
- 可按

沒有題目或已抽完：

- 按鈕變灰
- 不可按
- 只保留分類名稱
- 不顯示剩餘題目數
- 不顯示完成題數
- 不顯示原因文字

### 分類主頁控制

分類主頁不顯示：

- 返回首頁
- 全螢幕按鈕
- 大型新遊戲按鈕

右上角保留一個細小的「重設／新遊戲」圖示。

按下圖示後：

- 不需要確認
- 立即清除本局進度
- 保持在分類主頁
- 所有分類恢復可用狀態

### 選擇分類行為

點擊分類後：

1. 從該分類中找出未出現過的題目
2. 隨機抽出一條
3. 立即把該題 ID 加入已出題記錄
4. 進入題目頁
5. 題目顯示，但倒數未開始

重要：題目一經顯示，即視為已出題。即使使用者未按開始便返回分類，該題在同一局內也不可再次出現。

---

## 9. 題目頁規格

### 頁面背景

- 所有分類使用相同純淺色背景
- 不使用插畫背景
- 不使用深色背景
- 不使用動畫背景

### 題目頁內容排列

由上至下建議順序：

1. 分類名稱
2. 圓形倒數進度環
3. 題目文字
4. 主要控制按鈕

### 分類名稱

- 顯示於題目上方
- 使用清晰文字
- 可配合分類圖示

### 題目文字

- 超大型字體
- 水平及垂直置中
- 只支援純文字
- 題目太長時自動縮細字體
- 不使用滾動作為首選
- 必須確保完整題目可以顯示

建議依文字長度設定字級，例如：

- 1–20 字：最大字級
- 21–40 字：中大型字級
- 41 字以上：較小但仍清晰

### 題目未開始狀態

顯示：

- 分類名稱
- 題目
- 60 秒圓形進度環
- 大型「開始」按鈕
- 「跳過」按鈕
- 「返回分類」按鈕

按「開始」後才開始倒數。

---

## 10. 倒數規格

### 基本規則

- 固定 60 秒
- 不可調整
- 按開始後才倒數
- 開始按鈕變成「暫停」
- 暫停後按鈕變成「繼續」
- 暫停時題目仍然顯示

### 計時實作要求

不得只依賴每秒 `remainingSeconds - 1`。

應記錄：

- 倒數開始時間
- 預計結束時間
- 暫停時間
- 剩餘秒數

重新整理或切換分頁後，應以真實時間重新計算剩餘秒數。

### 背景切換

使用者切換至其他分頁或平板短暫鎖屏時：

- 倒數繼續
- 返回後顯示正確剩餘時間

### 暫停

按「暫停」後：

- 計時停止
- 題目仍顯示
- 進度環停留在當前位置
- 按鈕文字變成「繼續」

按「繼續」後：

- 從剩餘秒數繼續倒數

### 最後 10 秒

- 不播放聲音
- 數字每秒輕微放大一下
- 進度環維持分類顏色
- 不轉紅
- 不閃動整個畫面

### 0 秒

時間到後：

- 圓形倒數區顯示大型「時間到」
- 停止倒數
- 不播放聲音
- 不自動返回分類主頁

顯示按鈕：

- 完成
- 返回分類

不顯示：

- 跳過
- 暫停
- 繼續

---

## 11. 題目頁按鈕規格

### 開始／暫停／繼續

- 題目下方顯示大型按鈕
- 未開始：顯示「開始」
- 倒數中：顯示「暫停」
- 暫停中：顯示「繼續」

### 完成

- 大型主要按鈕
- 使用目前分類顏色
- 倒數開始後可隨時按
- 按下後立即返回分類主頁
- 不顯示完成動畫
- 不顯示確認視窗

### 跳過

- 灰色次要按鈕
- 題目未開始或倒數進行中均可按
- 按下後立即從同一分類抽下一條未出題題目
- 不顯示確認視窗
- 不使用過場動畫
- 新題目顯示後倒數重設為 60 秒
- 新題目不自動開始倒數
- 必須由使用者再次按「開始」

如該分類已沒有下一題：

1. 顯示「此分類題目已完成」
2. 返回分類主頁
3. 該分類變灰

### 返回分類

- 灰色次要按鈕
- 按下後立即返回分類主頁
- 不顯示確認視窗
- 不使用過場動畫
- 當前題目已視為出題，不可再次出現

### 按鈕排列

倒數開始後：

- 「完成」為大型主按鈕
- 「跳過」及「返回分類」為較小次要按鈕
- 所有按鈕放在畫面底部操作區

---

## 12. 抽題及不重覆規則

### 抽題方式

- 分類內完全隨機
- 後台排序不影響抽題次序
- 每條題目只屬於一個分類

### 已出題判定

以下情況均視為已出題：

- 題目被系統顯示
- 按完成
- 按跳過
- 按返回分類
- 時間到後返回分類
- 重新整理後仍停留在目前題目

最簡單可靠做法：題目抽出並顯示時，立即將 ID 加入 `usedQuestionIds`。

### 分類完成判定

當分類內所有啟用題目 ID 均存在於 `usedQuestionIds`：

- 該分類視為完成
- 分類按鈕變灰
- 不可再按

### 全局完成判定

當所有有題目的分類均完成：

- 自動進入完成頁

---

## 13. 全部完成頁規格

顯示：

```text
本局遊戲已完成
```

並顯示大型按鈕：

```text
開始新遊戲
```

按下後：

- 清除所有遊戲狀態
- 返回分類主頁

不需要顯示：

- 完成題數
- 分類統計
- 分數
- 遊戲時間
- 返回首頁

---

## 14. 遊戲狀態資料結構

建議 TypeScript 型別：

```ts
export type GameStatus = 'idle' | 'ready' | 'running' | 'paused' | 'expired';

export interface GameSession {
  usedQuestionIds: string[];
  currentCategoryId: string | null;
  currentQuestionId: string | null;
  status: GameStatus;
  remainingSeconds: number;
  endTimestamp: number | null;
  updatedAt: number;
}
```

### 儲存方式

MVP 可使用 `sessionStorage`。

理由：

- 同一分頁重新整理後可恢復
- 關閉整個瀏覽器後可清除遊戲進度
- 符合本階段需求

建議 key：

```text
preteen-game-session-v1
```

### 恢復規則

重新整理題目頁時：

- 恢復目前題目
- 恢復目前分類
- 恢復倒數狀態
- 如倒數原本正在進行，根據 `endTimestamp` 重新計算
- 如時間已過，顯示「時間到」
- 如原本暫停，保持暫停

如 session 無效、題目已被刪除或資料結構不完整：

- 安全清除 session
- 返回首頁

---

## 15. 本地題庫資料結構

建議檔案：

```text
src/data/categories.ts
src/data/questions.ts
```

型別：

```ts
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface Question {
  id: string;
  categoryId: string;
  text: string;
  sortOrder: number;
  enabled: boolean;
}
```

雖然 MVP 不設後台，仍建議保留 `enabled`，方便暫停使用某些題目。

---

## 16. 預設分類資料

```ts
export const categories: Category[] = [
  {
    id: 'action',
    name: '動作',
    icon: 'PersonStanding',
    color: '#FF7A59',
    sortOrder: 1,
  },
  {
    id: 'english',
    name: '英文',
    icon: 'Languages',
    color: '#4D96FF',
    sortOrder: 2,
  },
  {
    id: 'mandarin',
    name: '國語',
    icon: 'MessageCircle',
    color: '#9B5DE5',
    sortOrder: 3,
  },
  {
    id: 'cantonese',
    name: '廣東話',
    icon: 'MessagesSquare',
    color: '#00B894',
    sortOrder: 4,
  },
  {
    id: 'teamwork',
    name: '二人合作',
    icon: 'Users',
    color: '#F4B400',
    sortOrder: 5,
  },
];
```

顏色可因 UI 對比度稍作微調，但應保持活潑鮮色及清晰可讀。

---

## 17. MVP 預設少量問題庫

每個分類先提供 6 題，共 30 題。

### 動作

1. 扮一隻正在追自己尾巴的狗
2. 扮一個剛剛踩到積木的人
3. 不出聲扮演正在打籃球
4. 扮一個很怕凍的人
5. 扮演超級英雄降落地面
6. 用動作表演正在乘坐過山車

### 英文

1. 用英文講出五種食物
2. 用英文介紹自己三句
3. 用英文講出四種動物
4. 用英文形容你今日的心情
5. 用英文講出三樣課室內見到的物件
6. 用英文說出你最喜歡的遊戲及原因

### 國語

1. 用國語介紹自己三句
2. 用國語講出五種水果
3. 用國語形容今天的天氣
4. 用國語講出三樣你喜歡做的事情
5. 用國語說出四種動物
6. 用國語分享你最喜歡的食物

### 廣東話

1. 用廣東話講一個你最近最開心的時刻
2. 用三個詞語形容自己
3. 講出五樣返學要帶的物品
4. 分享一樣你最想學識的技能
5. 講出三樣你認為好朋友應有的特質
6. 用一句說話介紹你最喜歡的興趣

### 二人合作

1. 二人背對背坐下，再一起站起來
2. 二人不用說話，合作擺出一個心形以外的圖案
3. 二人輪流講數字，由 1 數到 20，不能同時開口
4. 一人做動作，另一人像鏡子一樣同步模仿
5. 二人只用一隻手合作把一件物件移到指定位置
6. 二人一起擺出一個超級英雄團隊姿勢

建議資料：

```ts
export const questions: Question[] = [
  { id: 'action-001', categoryId: 'action', text: '扮一隻正在追自己尾巴的狗', sortOrder: 1, enabled: true },
  { id: 'action-002', categoryId: 'action', text: '扮一個剛剛踩到積木的人', sortOrder: 2, enabled: true },
  { id: 'action-003', categoryId: 'action', text: '不出聲扮演正在打籃球', sortOrder: 3, enabled: true },
  { id: 'action-004', categoryId: 'action', text: '扮一個很怕凍的人', sortOrder: 4, enabled: true },
  { id: 'action-005', categoryId: 'action', text: '扮演超級英雄降落地面', sortOrder: 5, enabled: true },
  { id: 'action-006', categoryId: 'action', text: '用動作表演正在乘坐過山車', sortOrder: 6, enabled: true },

  { id: 'english-001', categoryId: 'english', text: '用英文講出五種食物', sortOrder: 1, enabled: true },
  { id: 'english-002', categoryId: 'english', text: '用英文介紹自己三句', sortOrder: 2, enabled: true },
  { id: 'english-003', categoryId: 'english', text: '用英文講出四種動物', sortOrder: 3, enabled: true },
  { id: 'english-004', categoryId: 'english', text: '用英文形容你今日的心情', sortOrder: 4, enabled: true },
  { id: 'english-005', categoryId: 'english', text: '用英文講出三樣課室內見到的物件', sortOrder: 5, enabled: true },
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
  { id: 'cantonese-004', categoryId: 'cantonese', text: '分享一樣你最想學識的技能', sortOrder: 4, enabled: true },
  { id: 'cantonese-005', categoryId: 'cantonese', text: '講出三樣你認為好朋友應有的特質', sortOrder: 5, enabled: true },
  { id: 'cantonese-006', categoryId: 'cantonese', text: '用一句說話介紹你最喜歡的興趣', sortOrder: 6, enabled: true },

  { id: 'teamwork-001', categoryId: 'teamwork', text: '二人背對背坐下，再一起站起來', sortOrder: 1, enabled: true },
  { id: 'teamwork-002', categoryId: 'teamwork', text: '二人不用說話，合作擺出一個心形以外的圖案', sortOrder: 2, enabled: true },
  { id: 'teamwork-003', categoryId: 'teamwork', text: '二人輪流講數字，由 1 數到 20，不能同時開口', sortOrder: 3, enabled: true },
  { id: 'teamwork-004', categoryId: 'teamwork', text: '一人做動作，另一人像鏡子一樣同步模仿', sortOrder: 4, enabled: true },
  { id: 'teamwork-005', categoryId: 'teamwork', text: '二人只用一隻手合作把一件物件移到指定位置', sortOrder: 5, enabled: true },
  { id: 'teamwork-006', categoryId: 'teamwork', text: '二人一起擺出一個超級英雄團隊姿勢', sortOrder: 6, enabled: true },
];
```

---

## 18. 建議元件結構

```text
src/
├─ app/
│  └─ router.tsx
├─ pages/
│  ├─ HomePage.tsx
│  ├─ CategoryPage.tsx
│  ├─ QuestionPage.tsx
│  └─ GameCompletePage.tsx
├─ components/
│  ├─ CategoryCard.tsx
│  ├─ CountdownRing.tsx
│  ├─ QuestionText.tsx
│  ├─ GameControls.tsx
│  └─ ResetGameButton.tsx
├─ hooks/
│  ├─ useGameSession.ts
│  └─ useCountdown.ts
├─ data/
│  ├─ categories.ts
│  └─ questions.ts
├─ types/
│  └─ game.ts
├─ utils/
│  ├─ randomQuestion.ts
│  └─ storage.ts
└─ styles/
   └─ global.css
```

---

## 19. 核心函式建議

```ts
function getAvailableQuestions(
  categoryId: string,
  questions: Question[],
  usedQuestionIds: string[]
): Question[]
```

```ts
function pickRandomQuestion(questions: Question[]): Question | null
```

```ts
function isCategoryComplete(
  categoryId: string,
  questions: Question[],
  usedQuestionIds: string[]
): boolean
```

```ts
function isGameComplete(
  categories: Category[],
  questions: Question[],
  usedQuestionIds: string[]
): boolean
```

```ts
function resetGameSession(): GameSession
```

所有抽題、完成判定及儲存邏輯應集中處理，不應分散在多個頁面中重覆實作。

---

## 20. 全螢幕模式

使用者原先要求進入遊戲後自動嘗試全螢幕。

但瀏覽器通常要求全螢幕必須由使用者操作觸發，因此建議：

- 使用者按首頁「新遊戲」時呼叫 Fullscreen API
- 如瀏覽器拒絕或不支援，不顯示錯誤
- 遊戲仍正常繼續
- 不把全螢幕失敗視為功能失敗

---

## 21. 基本離線支援

MVP 要求：

- 第一次成功載入網站後，可在沒有網絡時重新開啟遊戲介面
- 本地題庫可正常使用
- 本階段沒有後台，因此不存在離線後台限制問題

建議：

- 使用 `vite-plugin-pwa`
- 快取 HTML、CSS、JavaScript、icon 及本地題庫
- 使用簡單 app-shell 策略

不需要：

- 複雜更新提示
- 離線同步佇列
- 背景同步

---

## 22. 錯誤處理

### 沒有可用題目

若分類存在但沒有啟用題目：

- 分類按鈕變灰
- 不可點擊

### 題目資料錯誤

若目前題目 ID 找不到：

- 清除目前題目狀態
- 返回分類主頁
- 保留其他已出題記錄

### Storage 不可用

若 sessionStorage 不可用：

- 遊戲仍應可在目前頁面操作
- 可使用 React state 作 fallback
- 不應令網站白屏

### 全部分類沒有題目

- 分類主頁所有分類變灰
- 顯示「暫時沒有可用題目」
- 不進入完成頁

---

## 23. Responsive 規格

### 主要斷點

優先設計：

- iPad 橫向
- Android 平板橫向
- 1024×768 或以上

亦需基本支援：

- 平板直向
- 手機
- 桌面瀏覽器

### 類別卡片

- 橫向平板：3 + 2 排列
- 較窄畫面：2 欄網格
- 手機：1 或 2 欄，按實際寬度調整

### 題目頁

- 不可因內容超出而遮蓋底部按鈕
- 倒數環、題目及按鈕必須在一般平板畫面內完整可見

---

## 24. 無障礙及易用性

- 所有按鈕必須有明確文字或 aria-label
- 顏色不可作為唯一狀態提示，但已完成分類可透過 disabled 狀態表達
- 文字與背景應有足夠對比
- 點擊區域至少約 44×44 px
- 支援鍵盤基本操作
- disabled 分類卡片不得可聚焦或觸發抽題

---

## 25. MVP 驗收標準

Codex 完成後必須逐項測試。

### 首頁

- [ ] 首頁只顯示新遊戲按鈕
- [ ] 按新遊戲後清除舊進度
- [ ] 按新遊戲後進入分類主頁

### 分類

- [ ] 顯示五個預設分類
- [ ] 平板橫向時以 3 + 2 排列
- [ ] 每個分類有不同顏色及圖示
- [ ] 點分類後隨機抽出該分類題目
- [ ] 沒有題目的分類變灰
- [ ] 題目用完的分類變灰

### 不重覆

- [ ] 題目顯示後立即記錄為已出題
- [ ] 完成後不會再次抽到同一題
- [ ] 跳過後不會再次抽到同一題
- [ ] 返回分類後不會再次抽到同一題
- [ ] 同一局內所有題目均不可重覆
- [ ] 開始新遊戲後所有題目可重新出現

### 倒數

- [ ] 題目出現後不會自動倒數
- [ ] 按開始後從 60 秒開始
- [ ] 可暫停
- [ ] 可繼續
- [ ] 暫停時題目仍顯示
- [ ] 切換分頁後倒數仍準確
- [ ] 重新整理後倒數仍準確
- [ ] 最後 10 秒數字每秒輕微放大
- [ ] 0 秒顯示時間到
- [ ] 時間到不播放聲音

### 題目操作

- [ ] 完成後立即返回分類主頁
- [ ] 跳過後立即抽同分類下一題
- [ ] 跳過後新題目保持未開始狀態
- [ ] 返回分類後立即返回
- [ ] 時間到後只顯示完成及返回分類

### 全局完成

- [ ] 所有分類用完後顯示本局遊戲已完成
- [ ] 可按開始新遊戲重設全部進度

### 儲存

- [ ] 重新整理後保留目前題目
- [ ] 重新整理後保留已出題記錄
- [ ] 重新整理後保留暫停狀態
- [ ] 關閉瀏覽器後不要求保留遊戲進度

### 離線

- [ ] 首次成功開啟後可離線載入
- [ ] 離線時可正常抽題及倒數

### Build

- [ ] `npm run build` 成功
- [ ] TypeScript 無錯誤
- [ ] Console 無明顯 runtime error

---

## 26. Codex 執行指示

請 Codex 按以下次序工作：

1. 檢查現有 repo 結構及 `AGENTS.md`
2. 建立或確認 React + TypeScript + Vite 基礎
3. 建立本地分類及題庫資料
4. 建立遊戲 session 狀態管理
5. 建立首頁
6. 建立分類主頁
7. 建立抽題及不重覆邏輯
8. 建立題目頁
9. 建立倒數、暫停、恢復及時間到狀態
10. 建立全部完成頁
11. 加入 sessionStorage 恢復
12. 加入基本 PWA 離線支援
13. 完成 responsive 及平板橫向介面
14. 執行 build 及功能測試
15. 如 repo 的 `AGENTS.md` 要求 review file，必須建立並列出路徑

不要在本階段：

- 建立 Supabase client
- 建立資料庫 schema
- 建立 `/admin`
- 安裝 authentication 套件
- 建立管理密碼
- 建立 API route

---

## 27. Codex 完成後應回報

Codex 最終回覆必須包括：

1. 完成了哪些頁面
2. 遊戲狀態如何儲存
3. 倒數如何確保切換分頁後仍準確
4. 不重覆題目如何處理
5. PWA 離線功能如何處理
6. 測試結果
7. `npm run build` 結果
8. 所有新增及修改檔案
9. 尚未完成或已知限制
10. review file 路徑（如適用）

---

## 28. MVP 完成後的下一階段

只有當以上 MVP 驗收全部通過後，才進入 Phase 2：

- 建立 Supabase
- Categories table
- Questions table
- 管理後台
- 固定密碼登入
- 分類管理
- 題目管理
- 批量新增
- 拖拉排序
- 多裝置同步

Phase 2 不屬於本次 Codex 任務。

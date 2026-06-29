datasource db {
  provider = "sqlite"
  url      = "file:./dev.db" // Cloudflare D1（内部はSQLite）を使用するための設定
}

generator client {
  provider = "prisma-client-js"
}

// ==========================================
// 1. ユーザー管理
// ==========================================
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // ハッシュ化されたパスワード
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // リレーション
  clients        Client[]
  rewardSettings RewardSetting[]
}

// ==========================================
// 2. クライアント（対象）管理
// ==========================================
model Client {
  id        String   @id @default(uuid())
  name      String   // 例: 「A株式会社」「自分（自己投資）」「家族」
  isPrivate Boolean  @default(false) // グラフの集計時やUIの出し分け（仕事/プライベート）に便利
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // リレーション
  userId     String
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  priceCards PriceCard[]
  timeLogs   TimeLog[]

  @@index([userId]) // ユーザーごとのクライアント一覧取得を高速化
}

// ==========================================
// 3. カテゴリ & 価値カード（単価設定）
// ==========================================
model TaskCategory {
  id        String   @id @default(uuid())
  name      String   // 例: 「コーディング」「デザイン」「勉強」「育児/家事」
  createdAt DateTime @default(now())

  // リレーション
  priceCards PriceCard[]
  timeLogs   TimeLog[]
}

model PriceCard {
  id             String   @id @default(uuid())
  valueType      String   // "MONEY"（円） か "STAMP"（スタンプ）
  amount         Int      // MONEYなら「3000」、STAMPなら「1」などの量
  stampIcon      String?  // STAMPの場合のみ「❤️」「⭐️」「🎮」などを格納。MONEYの時はnull
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // リレーション
  clientId       String
  client         Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  taskCategoryId String
  taskCategory   TaskCategory @relation(fields: [taskCategoryId], references: [id], onDelete: Cascade)

  // 💡 複合ユニーク制約：1つのクライアントに対して、同じ作業カテゴリの単価カードは1枚だけ
  @@unique([clientId, taskCategoryId])
}

// ==========================================
// 4. タイムログ（実績）
// ==========================================
model TimeLog {
  id             String    @id @default(uuid())
  description    String    // 具体的な作業メモ（例：「仕様書の確認」「子供と公園で遊ぶ」）
  startTime      DateTime  @default(now())
  endTime        DateTime? // null の場合は「現在計測中」
  isInterrupt    Boolean   @default(false) // 割り込みタスクだったかどうかのフラグ
  createdAt      DateTime  @default(now())

  // リレーション
  clientId       String
  client         Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)
  taskCategoryId String
  taskCategory   TaskCategory @relation(fields: [taskCategoryId], references: [id], onDelete: Cascade)

  // 💡 インデックス：集計API（「今月のログ一覧」など）の検索・ソートを爆速にする
  @@index([clientId])
  @@index([startTime, endTime]) 
}

// ==========================================
// 5. 【追加】スタンプのご褒美設定
// => 保留・今は使わない
// ==========================================
model RewardSetting {
  id           String   @id @default(uuid())
  title        String   // 例: 「カフェで新作フラペチーノを飲む」「欲しかったゲームを買う」
  requiredLogs Int      // 達成に必要なスタンプ数（例: 10個, 30個）
  createdAt    DateTime @default(now())

  // リレーション
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
# プロジェクト概要
Hono + D1 + Prisma　で作る タスク・工数管理ツール  
ログイン認証付き  
クライアント × タスク × 時間 × リターン でコストとリターンを可視化
基本計算はコスト × 時間で計算。  


# アーキテクチャ
 - フロントエンド： Vite + React (typescript)
   - ホスティング：Cloudflare Pages 
 - バックエンド：Hono + drizzle
   - ホスティング： Cloudflare Workers
 - データベース：Cloudflare D1 (SQlite)

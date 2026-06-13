# プロジェクト概要
Hono + D1 + Prisma　で作る タスク・工数管理ツール  
ログイン認証付き  
クライアント × タスク × 時間 × リターン でコストとリターンを可視化
基本計算はコスト × 時間で計算。  


# アーキテクチャ
 - フロントエンド： Vite + React (typescript)
   - ホスティング：Cloudflare Pages 
 - バックエンド：Hono
   - ホスティング： Cloudflare Workers
 - データベース：Cloudflare D1 (SQlite)


# 作業フロー
1. データベース設計とPrismaのセットアップ
  - WranglerでD1データベースを作成する
  - Prismaの設定（schema.prisma）を書く
2. Honoで「CRUD API」の構築（難所）
3. JWTによる認証・認可の実装（難所）
  - サインアップ/ログインAPIの作成
  - HonoミドルウェアによるAPIの保護
4. 応用ロジックの実装
  - 割り込みタスク（ポーズ＆割り込み）のロジックをバックエンドに実装
  - その他、独自のUIアイディアに対応する応用ロジックの組み込み
5. Reactフロントエンドの実装と結合
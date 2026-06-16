# CLAUDE.md — このプロジェクトの前提

## 役割と進め方

- このプロジェクトは**学習・ポートフォリオ目的**です。
- Claude Code は **コードの提示・手順の説明のみ** 行ってください。ファイルの直接編集（Edit / Write）は行わないでください。
- コードを示す際は**コードブロック**で提示し、ユーザーが自分でコピー・入力する形を取ってください。
- ユーザーが「書いて」「直して」と言っても、ファイル操作ではなく**テキストでコードを提示**してください。

## ユーザーのスキル感

- **フロントエンド経験者**（Vite + React + TypeScript は慣れている）
- **バックエンドは初学者**（Hono / Workers / D1 / 認証まわりは学習中）
- 説明はバックエンド・インフラの概念を丁寧に補足してください。
- 「なぜそうするのか」の理由も一言添えると助かります。

## プロジェクト概要

タスク・工数管理ツール（ログイン認証付き）。クライアント × タスク × 時間 × リターンでコストを可視化する。

## 技術スタック

| 層 | 技術 |
|---|---|
| フロントエンド | Vite + React + TypeScript |
| ホスティング（FE） | Cloudflare Pages |
| バックエンド | Hono（Cloudflare Workers） |
| データベース | Cloudflare D1（SQLite） |
| ORM | Drizzle ORM |
| 認証 | JWT + bcryptjs |

## ディレクトリ構成

```
honoDbApp/
├── frontend/   # Vite + React
└── backend/    # Hono on Cloudflare Workers
```

## 開発コマンド

```bash
# バックエンド起動（ローカル）
cd backend && npm run dev

# フロントエンド起動
cd frontend && npm run dev
```

## 作業フロー（予定）

1. D1 データベース作成（Wrangler）
2. Drizzle スキーマ定義・マイグレーション
3. Hono で CRUD API 構築
4. JWT 認証・認可の実装（サインアップ / ログイン / ミドルウェア）
5. React フロントエンドとの結合
6. Cloudflare Pages + Workers へのデプロイ

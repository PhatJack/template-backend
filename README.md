# 🚀 Hướng Dẫn Chạy Backend

Backend được xây dựng bằng **TypeScript**, **Express.js** và **MongoDB**.

---

## 📋 Yêu Cầu Hệ Thống

- Node.js >= 22
- MongoDB
- pnpm / npm / yarn

---

## ⚡ Chạy Nhanh Dự Án

### 1. Cài đặt thư viện

```bash
pnpm install
```

> Có thể thay bằng `npm install` hoặc `yarn install`

---

### 2. Cấu hình biến môi trường

Tạo file `.env` từ file `.env.example`

#### Linux/macOS

```bash
cp .env.example .env
```

#### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Sau đó điền các giá trị cần thiết vào file `.env`.

---

### 3. Chạy server development

```bash
pnpm dev
```

Backend sẽ chạy tại:

```txt
http://localhost:3000
```

---

## 📦 Các Script Có Sẵn

```bash
pnpm dev      # chạy môi trường development
pnpm build    # build project
pnpm start    # chạy bản production
```

---

## 🛠️ Công Nghệ Sử Dụng

- TypeScript
- Express.js
- MongoDB
- Mongoose

---

## 🔐 Biến Môi Trường

Ví dụ file `.env`:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=your_cors_origin_here

# MongoDB
MONGODB_URI=your_mongodb_uri_here
GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-3-flash-preview
GEMINI_MODEL=your_gemini_model_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```
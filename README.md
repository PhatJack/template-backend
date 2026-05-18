# 🚀 Hướng Dẫn Chạy Backend

Backend được xây dựng bằng **TypeScript**, **Express.js** và **MongoDB**.

---

## 📋 Yêu Cầu Hệ Thống

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

- **Node.js** (phiên bản 18 hoặc cao hơn)
- **Package Manager**: chọn một trong pnpm/npm/yarn
- **MongoDB** (nếu sử dụng cơ sở dữ liệu)

### 1. **Node.js** (phiên bản 18+)

- Tải từ: https://nodejs.org/

### 2. Chọn Package Manager

Bạn có thể sử dụng một trong ba package manager sau:

#### **pnpm** (phiên bản 8+) - KHUYẾN NGHỊ

```bash
npm install -g pnpm
pnpm --version
```

#### **npm** (phiên bản 9+) - Mặc định với Node.js

```bash
npm --version
```

#### **yarn** (phiên bản 3+)

```bash
npm install -g yarn
yarn --version
```

### Kiểm Tra Cài Đặt

```bash
node --version
pnpm --version  # hoặc: npm --version, yarn --version
```

---

## 🚀 Hướng Dẫn Nhanh Chạy Backend

### Bước 1: Cài Đặt Thư Viện

Từ thư mục `template-backend`:

**Với pnpm (khuyến nghị):**

```bash
pnpm install
```

**Với npm:**

```bash
npm install
```

**Với yarn:**

```bash
yarn install
```

### Bước 2: Cấu Hình Biến Môi Trường

1. **Tạo file `.env`** từ file example:

**Với Linux/macOS:**

```bash
cp .env.example .env
```

**Với Windows PowerShell:**

```bash
Copy-Item .env.example .env
```

2. **Chỉnh sửa file `.env`** và điền các giá trị cần thiết

## ▶️ Chạy Ứng Dụng Backend

**Với pnpm:**

```bash
pnpm run dev
```

**Với npm:**

```bash
npm run dev
```

**Với yarn:**

```bash
yarn dev
```

Xong! 🎉 Backend sẽ chạy tại **http://localhost:3000**

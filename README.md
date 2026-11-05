# DentalFlow - Playwright Test Automation Framework

Dự án kiểm thử tự động (Automation Testing) cho hệ thống **DentalFlow** sử dụng **Playwright** + **TypeScript** theo mô hình thiết kế **Page Object Model (POM)**.

---

## 📖 BẢNG TỔNG HỢP CÂU LỆNH (CHEATSHEET)

### 1. CÁC CÂU LỆNH CHẠY PLAYWRIGHT

#### 🔹 1.1. Chạy cơ bản
| Mục đích | Câu lệnh |
| :--- | :--- |
| **Chạy toàn bộ test** (chạy ngầm - headless) | `npx playwright test` *(hoặc `npm test`)* |
| **Chạy có mở trình duyệt** (headed mode) | `npx playwright test --headed` *(hoặc `npm run test:headed`)* |
| **Mở giao diện UI tương tác** *(khuyên dùng khi viết test)* | `npx playwright test --ui` *(hoặc `npm run test:ui`)* |
| **Xem báo cáo HTML** sau khi test xong | `npx playwright show-report` *(hoặc `npm run test:report`)* |

#### 🔹 1.2. Chạy theo trình duyệt chỉ định
```bash
# Chỉ chạy trên Chromium (Chrome)
npx playwright test --project=chromium

# Chỉ chạy trên Firefox
npx playwright test --project=firefox

# Chỉ chạy trên WebKit (Safari)
npx playwright test --project=webkit
```

#### 🔹 1.3. Chạy theo file cụ thể
```bash
# Chạy toàn bộ test trong file login
npx playwright test tests/login.spec.ts --project=chromium

# Chạy có mở trình duyệt để quan sát
npx playwright test tests/login.spec.ts --project=chromium --headed

# Chạy riêng file quản lý khách hàng
npx playwright test tests/customer-creation.spec.ts --project=chromium
```

#### 🔹 1.4. Chạy một hoặc một nhóm Test Case cụ thể (bằng cờ `-g`)
```bash
# Chạy duy nhất ca test LILO-105
npx playwright test tests/login.spec.ts -g "LILO-105" --project=chromium --headed

# Chạy một nhóm các test case (dùng dấu gạch đứng | để nối)
npx playwright test tests/login.spec.ts -g "LILO-016|LILO-032|LILO-100|LILO-105" --project=chromium --headed
```

#### 🔹 1.5. Chế độ Debug lỗi chuyên sâu
```bash
# Bật Playwright Inspector (dừng lại từng bước, cho phép step over / inspect locator)
npx playwright test tests/login.spec.ts -g "LILO-105" --debug
```

---

### 2. CÁC CÂU LỆNH GIT (PULL & PUSH)

#### 🔹 2.1. Kiểm tra trạng thái làm việc
```bash
# Xem danh sách các file đã sửa đổi, thêm mới hoặc chưa commit
git status
```

#### 🔹 2.2. Lấy code mới nhất về máy (Git Pull)
```bash
# Kéo code mới nhất từ nhánh trên server (ví dụ: main hoặc master)
git pull origin main

# Lệnh rút gọn (nếu nhánh hiện tại đã liên kết với remote upstream)
git pull
```

#### 🔹 2.3. Đẩy code lên Git (Git Push) - Quy trình 3 bước chuẩn
```bash
# Bước 1: Thêm toàn bộ các file đã thay đổi vào Staging Area
git add .

# (Tùy chọn: Nếu chỉ muốn thêm từng file cụ thể)
# git add src/pages/login.page.ts tests/login.spec.ts

# Bước 2: Tạo commit lưu lại lịch sử kèm thông điệp rõ ràng
git commit -m "feat: hoàn thiện kịch bản test tự động màn hình login DentalFlow"

# Bước 3: Đẩy commit lên nhánh trên server
git push origin main

# (Nếu là lần đầu tiên push một nhánh mới tạo lên remote)
# git push -u origin <ten-nhanh>
```

#### 🔹 2.4. Các lệnh Git tiện ích khác
```bash
# Tạo nhánh mới và chuyển sang nhánh đó
git checkout -b feature/login-tests

# Chuyển đổi qua lại giữa các nhánh
git checkout main

# Xem danh sách các commit gần nhất (ngắn gọn trên 1 dòng)
git log --oneline -5

# Hủy bỏ toàn bộ thay đổi chưa commit (quay về trạng thái ban đầu)
git restore .
```

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```
testauto-df/
├── .github/
│   └── workflows/playwright.yml    # Luồng CI/CD GitHub Actions chạy test tự động
├── src/
│   ├── components/                 # Các Component dùng chung (Sidebar, Header...)
│   ├── constants/                  # Hằng số hệ thống (URL routes, Test data, Env)
│   ├── data/                       # Models và Mock data phục vụ nhập liệu
│   ├── fixtures/                   # Custom Fixtures tự động inject Page Objects
│   ├── pages/                      # Page Object Model (BasePage, LoginPage, CustomerPage...)
│   └── utils/                      # Hàm tiện ích (Data generator, Date formatter...)
├── tests/
│   ├── auth.setup.ts               # Setup lưu session đăng nhập tái sử dụng
│   ├── login.spec.ts               # Bộ kịch bản kiểm thử màn hình Đăng nhập
│   └── customer-creation.spec.ts   # Kịch bản kiểm thử Tạo mới khách hàng
├── .env.example                    # File mẫu biến môi trường
├── playwright.config.ts            # Cấu hình trung tâm Playwright
├── tsconfig.json                   # Cấu hình TypeScript
└── README.md                       # Tài liệu hướng dẫn & cheatsheet câu lệnh

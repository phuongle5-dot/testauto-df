/**
 * ==============================================================================
 * FILE: src/utils/data-generator.ts
 * MỤC ĐÍCH: Cung cấp các hàm tiện ích sinh dữ liệu giả lập (Fake / Random Data) ngẫu nhiên.
 * LỢI ÍCH:
 * - Đảm bảo tính độc nhất của dữ liệu (Unique data) như Số điện thoại, Họ tên khách hàng.
 * - Tránh lỗi trùng lặp dữ liệu trên database khi chạy test nhiều lần liên tiếp.
 * ==============================================================================
 */

const FIRST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Vũ', 'Võ', 'Đặng', 'Bùi'];
const MIDDLE_NAMES = ['Văn', 'Thị', 'Đức', 'Minh', 'Ngọc', 'Hải', 'Thanh', 'Anh'];
const LAST_NAMES = ['Nam', 'Huyền', 'Tuấn', 'Linh', 'Dũng', 'Trang', 'Hương', 'Long', 'Khánh', 'An'];

/**
 * Sinh số điện thoại ngẫu nhiên hợp lệ tại Việt Nam (10 chữ số, các đầu số 090, 098, 097...)
 */
export function generateRandomPhone(): string {
  const prefixes = ['090', '091', '098', '097', '086', '088', '079', '077'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(1000000 + Math.random() * 9000000).toString().substring(0, 7);
  return `${prefix}${suffix}`;
}

/**
 * Sinh họ và tên tiếng Việt ngẫu nhiên (kết hợp ngẫu nhiên Họ + Tên đệm + Tên chính)
 */
export function generateRandomCustomerName(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const mid = MIDDLE_NAMES[Math.floor(Math.random() * MIDDLE_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${mid} ${last}`;
}

/**
 * Sinh chuỗi ký tự ngẫu nhiên theo độ dài tùy chọn
 * @param length Số lượng ký tự cần sinh (mặc định là 8)
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

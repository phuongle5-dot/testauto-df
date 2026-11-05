/**
 * ==============================================================================
 * FILE: src/constants/env.constant.ts
 * MỤC ĐÍCH: Tập hợp và đóng gói các biến môi trường cấu hình của hệ thống DentalFlow.
 * LỢI ÍCH:
 * - Đọc từ `process.env` (đã được nạp từ file `.env` hoặc hệ thống CI/CD).
 * - Cung cấp giá trị mặc định (fallback) nếu người dùng chưa khai báo biến môi trường.
 * - Hỗ trợ gợi ý code (Intellisense) và kiểm soát kiểu dữ liệu an toàn.
 * ==============================================================================
 */

export const ENV = {
  /** URL trang web cần kiểm thử */
  BASE_URL: process.env.BASE_URL || 'https://dentalflow20-test.ntq.solutions',

  /** Mã phòng khám (Clinic Code) */
  CLINIC_CODE: process.env.CLINIC_CODE || 'h123',

  /** Tên đăng nhập tài khoản quản trị */
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'ha123',

  /** Mật khẩu tài khoản quản trị */
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Dfc@2026',
};

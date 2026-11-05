/**
 * ==============================================================================
 * FILE: src/constants/routes.constant.ts
 * MỤC ĐÍCH: Quản lý tập trung toàn bộ đường dẫn URL (Routes / Endpoints) của hệ thống DentalFlow.
 * LỢI ÍCH:
 * - Tránh hardcode URL rải rác trong các bài test và page objects.
 * - Khi hệ thống thay đổi cấu trúc URL, chỉ cần cập nhật tại file này.
 * ==============================================================================
 */

export const ROUTES = {
  /** Đường dẫn đến trang đăng nhập (chuẩn hóa không gán cứng param redirect %2F) */
  LOGIN: '/auth/login',

  /** Đường dẫn đến danh sách quản lý khách hàng */
  CUSTOMER_LIST: '/customer',

  /** Đường dẫn trang chủ / dashboard */
  DASHBOARD: '/',
} as const;

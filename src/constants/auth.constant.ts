/**
 * ==============================================================================
 * FILE: src/constants/auth.constant.ts
 * MỤC ĐÍCH: Khai báo dữ liệu kiểm thử (Test Data) cho màn hình Đăng nhập (Login).
 * Dữ liệu được trích xuất từ file Test Case Excel / Sheet "Test data":
 * - CLINIC_VALID, USER_VALID, PASS_VALID (Lấy từ file .env / ENV constant)
 * - Các tài khoản chưa đăng ký (UNREG) và tài khoản sai (WRONG)
 * ==============================================================================
 */

import { ENV } from './env.constant';

export const AUTH_TEST_DATA = {
  // 1. Tài khoản hợp lệ (Lấy từ biến môi trường .env)
  CLINIC_VALID: ENV.CLINIC_CODE,
  USER_VALID: ENV.ADMIN_USERNAME,
  PASS_VALID: ENV.ADMIN_PASSWORD,

  // 2. Tài khoản đúng định dạng nhưng chưa đăng ký trên hệ thống
  CLINIC_UNREG: 'clinic_khongtontai',
  USER_UNREG: 'user_khongtontai',
  PASS_UNREG: 'Pass@khongtontai1',

  // 3. Tài khoản sai
  CLINIC_WRONG: 'clinic_sai',
  USER_WRONG: 'user_sai',
  PASS_WRONG: 'Sai@12345',

  // 4. Các thông điệp thông báo lỗi mong đợi (Expected validation & toast messages)
  MESSAGES: {
    CLINIC_REQUIRED: 'Vui lòng nhập mã phòng khám của bạn!',
    USERNAME_REQUIRED: 'Vui lòng nhập tên của bạn!',
    PASSWORD_REQUIRED: 'Vui lòng nhập mật khẩu của bạn!',
    LOGIN_FAILED: 'Đăng nhập thất bại',
  },
} as const;


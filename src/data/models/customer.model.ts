/**
 * ==============================================================================
 * FILE: src/data/models/customer.model.ts
 * MỤC ĐÍCH: Định nghĩa cấu trúc dữ liệu (Data Models / TypeScript Interfaces) của Khách hàng.
 * LỢI ÍCH:
 * - Quy định chặt chẽ các trường thông tin cần thiết khi thao tác với hồ sơ khách hàng.
 * - Hạn chế sai sót kiểu dữ liệu và sai chính tả tên thuộc tính trong quá trình viết code test.
 * ==============================================================================
 */

/** Danh sách giới tính được hỗ trợ trên hệ thống DentalFlow */
export type Gender = 'Nam' | 'Nữ' | 'Khác';

/** Interface mô tả dữ liệu đầy đủ của một khách hàng */
export interface CustomerData {
  /** Họ và tên khách hàng */
  fullName: string;

  /** Ngày tháng năm sinh (Định dạng: dd-mm-yyyy) */
  dob: string;

  /** Số điện thoại liên hệ (10 chữ số) */
  phone: string;

  /** Giới tính */
  gender: Gender;

  /** Địa chỉ liên lạc */
  address: string;
}

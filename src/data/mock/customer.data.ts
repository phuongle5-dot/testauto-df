/**
 * ==============================================================================
 * FILE: src/data/mock/customer.data.ts
 * MỤC ĐÍCH: Cung cấp hàm khởi tạo dữ liệu mẫu (Mock/Factory Data) cho hồ sơ khách hàng.
 * LỢI ÍCH:
 * - Tự động tạo dữ liệu ngẫu nhiên (tên, số điện thoại) để không bị trùng lặp dữ liệu trên database khi chạy lại nhiều lần.
 * - Cho phép ghi đè (override) từng trường thông tin tùy theo mục đích của từng test case cụ thể.
 * ==============================================================================
 */

import { CustomerData } from '../models/customer.model';
import { generateRandomCustomerName, generateRandomPhone } from '../../utils/data-generator';

/**
 * Sinh dữ liệu khách hàng hợp lệ và ngẫu nhiên.
 * @param override Các trường dữ liệu muốn ghi đè để kiểm thử trường hợp riêng biệt (ví dụ để trống, sai định dạng...)
 * @returns Đối tượng CustomerData hoàn chỉnh
 */
export function createValidCustomerData(override?: Partial<CustomerData>): CustomerData {
  return {
    fullName: generateRandomCustomerName(), // Sinh tên ngẫu nhiên: ví dụ "Nguyễn Văn Nam"
    dob: '15-05-1995',                     // Ngày sinh mặc định chuẩn định dạng
    phone: generateRandomPhone(),          // Sinh số điện thoại ngẫu nhiên hợp lệ (10 số)
    gender: 'Nam',                         // Giới tính mặc định
    address: 'Hà Nội, Việt Nam',           // Địa chỉ mặc định
    ...override,                           // Ghi đè dữ liệu tùy chỉnh nếu được truyền vào
  };
}

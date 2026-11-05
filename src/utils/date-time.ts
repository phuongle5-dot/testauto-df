/**
 * ==============================================================================
 * FILE: src/utils/date-time.ts
 * MỤC ĐÍCH: Cung cấp các hàm tiện ích xử lý định dạng thời gian và ngày tháng.
 * LỢI ÍCH:
 * - Chuẩn hóa định dạng ngày sinh, ngày hẹn đúng với yêu cầu hiển thị của form DentalFlow (dd-mm-yyyy).
 * ==============================================================================
 */

/**
 * Định dạng đối tượng Date sang chuỗi theo chuẩn 'dd-mm-yyyy'
 * @param date Đối tượng Date cần định dạng (mặc định lấy ngày giờ hiện tại)
 * @returns Chuỗi ngày dạng 2 chữ số ngày - 2 chữ số tháng - 4 chữ số năm (ví dụ: '05-11-2026')
 */
export function formatDateDMY(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

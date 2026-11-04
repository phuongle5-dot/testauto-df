import { CustomerData } from '../models/customer.model';
import { generateRandomCustomerName, generateRandomPhone } from '../../utils/data-generator';

/**
 * Sinh dữ liệu khách hàng hợp lệ và ngẫu nhiên để tránh trùng lặp dữ liệu khi chạy test
 */
export function createValidCustomerData(override?: Partial<CustomerData>): CustomerData {
  return {
    fullName: generateRandomCustomerName(),
    dob: '15-05-1995',
    phone: generateRandomPhone(),
    gender: 'Nam',
    address: 'Hà Nội, Việt Nam',
    ...override,
  };
}


export type Gender = 'Nam' | 'Nữ' | 'Khác';

export interface CustomerData {
  fullName: string;
  dob: string; // Định dạng dd-mm-yyyy
  phone: string;
  gender: Gender;
  address: string;
}


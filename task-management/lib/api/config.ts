// Cấu hình và các hằng số cho API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Cấu hình chung cho fetch request
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Xử lý lỗi từ API
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || response.statusText || 'Lỗi khi gọi API';
    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

// Lấy headers cơ bản
export function getHeaders(): HeadersInit {
  return { ...defaultHeaders };
}
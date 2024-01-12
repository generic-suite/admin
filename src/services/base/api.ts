import { request } from '@umijs/max';
// 查询vip等级信息
type ResType = {
  code: number;
  data: VipLevel[];
  message: string;
  success: boolean;
};
type VipLevel = {
  id: number;
  lavel: number;
  name: string;
  description: string | null;
  img: string | null;
};
export function getVipList() {
  return request<ResType>('/api/vip-list', {
    method: 'GET',
  });
}

import { request } from '@umijs/max';

// 获取产品列表
export async function getList(params: { current?: number; pageSize?: number }) {
  const res = await request<API.List>('/api/mid-bank/getCardList', {
    method: 'GET',
    params: {
      ...params,
    },
  });
  return {
    data: res.data.list,
    success: true,
    total: res.data?.pagination?.total,
  };
}

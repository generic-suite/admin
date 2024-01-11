import { request } from '@umijs/max';

// 获取列表
export async function getList(params: { current?: number; pageSize?: number }) {
  const res = await request<API.List>('/api/mid-order', {
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

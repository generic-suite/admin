import { request } from '@umijs/max';

// 获取列表
export async function getList(params: { current?: number; pageSize?: number }) {
  const res = await request<API.List>('/api/mid-withdraw', {
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

// 更新数据
export async function update(params: API.UpdateCommit) {
  return request<API.List>(`/api/mid-withdraw/${params.id}`, {
    method: 'Patch',
    data: {
      ...params,
    },
  });
}

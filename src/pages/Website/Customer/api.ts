import { request } from '@umijs/max';

// 获取列表
export async function getList(params: { current?: number; pageSize?: number }) {
  const res = await request<API.List>('/api/customer', {
    method: 'GET',
    params: {
      ...params,
    },
  });
  return {
    data: res.data,
    success: true,
  };
}

// 添加数据
export async function addData(params: API.Item) {
  return request<API.Item>('/api/customer', {
    method: 'POST',
    data: params,
  });
}

// 更新数据
export async function update(params: API.UpdateCommit) {
  return request<API.List>(`/api/customer/${params.id}`, {
    method: 'Patch',
    data: {
      ...params,
    },
  });
}

// 删除数据
export async function remove(params: { id: number }) {
  return request<API.List>(`/api/customer/${params.id}`, {
    method: 'DELETE',
  });
}

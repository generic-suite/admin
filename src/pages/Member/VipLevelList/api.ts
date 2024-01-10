import { request } from '@umijs/max';

// 获取产品列表
export async function getList(params: { current?: number; pageSize?: number; name?: string }) {
  const res = await request<API.ProductList>('/api/vip-list', {
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

// 添加会员
export async function addData(params: API.Item) {
  return request<API.Result>('/api/vip-list', {
    method: 'POST',
    data: params,
  });
}



// 删除产品
export async function removeData(id: number | string) {
  return request(`/api/vip-list/${id}`, {
    method: 'DELETE',
  });
}

// 编辑产品
export async function updateData(params: API.Item) {
  return request(`/api/vip-list/${params.id}`, {
    method: 'PATCH',
    data: params,
  });
}

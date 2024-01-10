import { request } from '@umijs/max';

// 获取产品列表
export async function getProductList(params: {
  current?: number;
  pageSize?: number;
  name?: string;
}) {
  const res = await request<API.ProductList>('/api/goods', {
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

// 添加产品
export async function addProduct(params: API.ProductListItem) {
  return request<API.ProductListItem>('/api/goods', {
    method: 'POST',
    data: params,
  });
}

// 删除产品
export async function removeProduct(id: number | string) {
  return request(`/api/goods/${id}`, {
    method: 'DELETE',
  });
}

// 编辑产品
export async function updateProduct(params: API.ProductListItem) {
  return request(`/api/goods/${params.id}`, {
    method: 'PATCH',
    data: params,
  });
}
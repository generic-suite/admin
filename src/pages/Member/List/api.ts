import { request } from '@umijs/max';

// 获取产品列表
export async function getList(params: { current?: number; pageSize?: number; name?: string }) {
  const res = await request<API.ProductList>('/api/mid-user', {
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
export async function addData(params: API.Register) {
  return request<API.Result>('/api/user/register', {
    method: 'POST',
    data: params,
  });
}

// 加扣款
export async function addMoney(params: API.AddMoney) {
  return request<API.Result>('/api/mid-user/change-balance', {
    method: 'POST',
    data: params,
  });
}

// 查询用户的银行信息
export async function getBankInfo(userId: number) {
  return request<API.Result>(`/api/mid-bank/getCard/${userId}`, {
    method: 'GET',
  });
}

// 设置用户的银行信息
export async function setBankInfo(userId: number, params: API.BankInfo) {
  return request<API.Result>(`/api/mid-bank/setCard/${userId}`, {
    method: 'POST',
    data: params,
  });
}

// 删除产品
export async function removeData(id: number | string) {
  return request(`/api/app-list/${id}`, {
    method: 'DELETE',
  });
}

// 编辑产品
export async function updateData(params: API.ListItem) {
  return request(`/api/app-list/${params.id}`, {
    method: 'PATCH',
    data: params,
  });
}

// 查询用户的vip等级
export async function getVipLevel(userId: number) {
  return request<API.Result>(`/api/mid-user/get-vip-level/${userId}`, {
    method: 'GET',
  });
}
// 设置用户的vip等级
export async function setVipLevel(data: API.VipLevel) {
  return request<API.Result>(`/api/mid-user/set-vip`, {
    method: 'POST',
    data
  });
}

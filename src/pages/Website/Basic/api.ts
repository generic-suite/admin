import { request } from '@umijs/max';

export async function queryBasicList() {
  return request('/api/system-config', {
    method: 'GET',
  });
}

export async function updateBasicList(params: any) {
  return request('/api/system-config', {
    method: 'PUT',
    data: params,
  });
}
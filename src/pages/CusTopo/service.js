import request from '@utils/request';

export function getTopo(params) {
  return request({
    url: '/api/v1/custopo',
    params: params,
  })
}
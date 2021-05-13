import request from '@/utils/request'

//修改安全码
export function setSafePwd(data) {
  return request({
    url: '/merch/merch_account/editSafePwd',
    method: 'post',
    data
  })
}
//核对安全码
export function checkSafePwd(data) {
    return request({
      url: '/merch/merch_account/checkSafePwd',
      method: 'get',
      params:data
    })
  }
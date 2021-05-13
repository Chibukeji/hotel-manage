import request from '@/utils/request'

//获取手机验证码
export function getMobileCode(data) {
  return request({
    url: '/merch/getMobileCode',
    method: 'get',
    params:data
  })
}
// 验证手机号和验证码
export function verifyPhone(data) {
    return request({
      url: '/merch/smsLogin',
      method: 'post',
      data
    })
}
//提交密码
export function setFindPassword(data) {
    return request({
      url: '/merch/findPassword',
      method: 'post',
      data
    })
}
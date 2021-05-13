import request from '@/utils/request'
//获取商家信息
export function getMerchantInfo(data) {
  return request({
    url: '/merch/merch/info',
    method: 'get',
    params: data
  })
}
//经营范围
export function getBusinessScopeList(data) {
    return request({
      url: '/main/merch/getScope',
      method: 'get',
      params: data
    })
}
//商家分类
export function getMerchantClassifyList(data) {
    return request({
      url: '/main/merch/getMerchCate',
      method: 'get',
      params: data
    })
}
//修改商家信息
export function setMerchantInfo(data) {
  return request({
    url: '/merch/merch/update',
    method: 'post',
    data
  })
}
//修改密码
export function changePassword(data) {
    return request({
      url: '/merch/merch/editPassword',
      method: 'post',
      data
    })
}
//获取手机验证码
export function getMobileCode(data) {
  return request({
    url: '/merch/merch/getMobileCode',
    method: 'post',
    data
  })
}
//更换微信
export function setWechat(data) {
  return request({
    url: '/merch/merch/setWechat',
    method: 'post',
    data
  })
}
//更换支付宝
export function setAlipay(data) {
  return request({
    url: '/merch/merch/setAlipay',
    method: 'post',
    data
  })
}

//更换银行卡
export function setBank(data) {
  return request({
    url: '/merch/merch/setBank',
    method: 'post',
    data
  })
}
//获取银行列表
export function getBank(data) {
  return request({
    url: '/merch/merch/getBank',
    method: 'get',
    params:data
  })
}
//更换手机号
export function setMobile(data) {
  return request({
    url: '/merch/merch/setMobile',
    method: 'post',
    data
  })
}


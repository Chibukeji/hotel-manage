import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/order-list',
  alwaysShow: true,
  id: 16,
  name: 'order',
  meta: {
    title: '订单管理',
    icon: 'list'
  },
  children: [
    {
      path: 'order-list',
      component: () => import('@/views/order/order-list'),
      name: 'order-list',
      id: 22,
      meta: { title: '订单列表'}
    },
    {
      path: 'refund-order',
      component: () => import('@/views/order/refund-order'),
      name: 'refund-order',
      id: 23,
      meta: { title: '退款订单'}
    },
  ]
}

export default orderRouter

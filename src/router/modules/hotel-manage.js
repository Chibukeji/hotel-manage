import Layout from '@/layout'

const hotelRouter = {
  path: '/hotel',
  component: Layout,
  redirect: '/hotel/hotel-list',
  alwaysShow: true,
  id: 14,
  name: 'hotel',
  meta: {
    title: '酒店管理',
    icon: 'hotel'
  },
  children: [
    {
      path: 'hotel-list',
      component: () => import('@/views/hotel-manage/hotel-list'),
      name: 'hotel-list',
      id: 20,
      meta: { title: '酒店列表'}
    },
  ]
}

export default hotelRouter

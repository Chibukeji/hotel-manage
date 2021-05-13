import Layout from '@/layout'

const financialRouter = {
  path: '/financial',
  component: Layout,
  redirect: '/financial/data-statistics',
  alwaysShow: true,
  id: 18,
  name: 'financial',
  meta: {
    title: '财务统计',
    icon: 'excel'
  },
  children: [
    {
      path: 'data-statistics',
      component: () => import('@/views/financial-manage/data-statistics'),
      name: 'data-statistics',
      id: 24,
      meta: { title: '数据统计'}
    },
    {
      path: 'hotel-statistics',
      component: () => import('@/views/financial-manage/hotel-statistics'),
      name: 'hotel-statistics',
      id: 25,
      meta: { title: '酒店统计' }
    },
    {
      path: 'hotel-withdraw',
      component: () => import('@/views/financial-manage/hotel-withdraw'),
      name: 'hotel-withdraw',
      id: 26,
      meta: { title: '酒店提现单' }
    },
    {
      path: 'overdue-withdraw',
      component: () => import('@/views/financial-manage/overdue-withdraw'),
      name: 'overdue-withdraw',
      id: 156,
      meta: { title: '分时过期提现单' }
    },
  ]
}

export default financialRouter

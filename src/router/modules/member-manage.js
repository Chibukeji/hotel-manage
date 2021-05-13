import Layout from '@/layout'

const merchantRouter = {
  path: '/member',
  component: Layout,
  redirect: '/member/member-list',
  alwaysShow: true,
  id: 15,
  name: 'member',
  meta: {
    title: '会员管理',
    icon: 'user'
  },
  children: [
    {
      path: 'member-list',
      component: () => import('@/views/member-manage/member-list'),
      name: 'member-list',
      id: 21,
      meta: { title: '会员列表' }
    },
  ]
}

export default merchantRouter

import Layout from '@/layout'

const staffRouter = {
  path: '/staff',
  component: Layout,
  redirect: '/staff/staff-list',
  alwaysShow: true,
  id: 19,
  name: 'staff',
  meta: {
    title: '员工管理',
    icon: 'people'
  },
  children: [
    {
      path: 'staff-list',
      component: () => import('@/views/staff-manage/staff-list'),
      name: 'staff-list',
      id: 27,
      meta: { title: '员工列表'}
    }
  ]
}
export default staffRouter

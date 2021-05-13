import Layout from '@/layout'

const securityRouter = {
  path: '/security',
  component: Layout,
  redirect: '/security/security-code',
  alwaysShow: false,
  id: 16,
  name: 'security',
  children: [
    {
      path: 'security-code',
      component: () => import('@/views/security-code/setsecurity-code'),
      name: 'security-code',
      id: 22,
      hidden: true,
      meta: { title: '修改安全码'}
    }
  ]
}
export default securityRouter
import Layout from '@/layout'

const commentRouter = {
  path: '/comment',
  component: Layout,
  redirect: '/comment/comment-list',
  alwaysShow: true,
  id: 36,
  name: 'comment',
  meta: {
    title: '评论管理',
    icon: 'edit'
  },
  children: [
    {
      path: 'comment-list',
      component: () => import('@/views/comment-manage/comment-list'),
      name: 'comment-list',
      id: 37,
      meta: { title: '评论列表',}
    },
  ]
}

export default commentRouter

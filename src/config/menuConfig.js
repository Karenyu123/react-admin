const menuList = [
  {
    title: '首页',
    key: '/admin/home',
    icon: 'home',
    isPublic: true
  },
  {
    title: '商品',
    key: '/admin/products',
    icon: 'appstore',
    children: [
      {
        title: '品类管理',
        key: '/admin/category',
        icon: 'bars'
      },
      {
        title: '商品管理',
        key: '/admin/product',
        icon: 'tool'
      },
    ]
  },
  {
    title: '角色管理',
    key: '/admin/role',
    icon: 'user'
  },
  {
    title: '用户管理',
    key: '/admin/user',
    icon: 'safety'
  },
  {
    title: '图表',
    key: '/admin/charts',
    icon: 'area-chart',
    children: [
      {
        title: '条形图',
        key: '/admin/charts/bar',
        icon: 'bar-chart'
      },
      {
        title: '折线图',
        key: '/admin/charts/line',
        icon: 'line-chart'
      },
      {
        title: '饼状图',
        key: '/admin/charts/pie',
        icon: 'pie-chart'
      }
    ]
  },
]

export default menuList
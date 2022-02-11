module.exports = {
  title: '小天宇',
  description: '小天宇的技术成长记录',
  theme: 'reco',
  themeConfig: {
    subSidebar: 'auto',
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/front-end/' },
      { text: '导航', link: '/guide/' },
      { text: 'Github', link: 'https://github.com/ninawangyimei'},
      { 
        text: '了解更多',
        items: [
          { text: '掘金', link: '#'},
          { text: '微信公众号', link: '#'}
        ]
      }
    ],
    sidebar: {
      '/guide/': [{
        title: '前端导航',
        link: '/guide/',
        collapsable: false,
        children: [
          { title: '导航', path: '/guide/'}
        ]
      }],
      '/front-end/': [{
        title: '前端知识',
        path: '/front-end/javascript',
        collapsable: false,
        children: [
          {
            title: 'JavaScript',
            path: '/front-end/javascript',
          },
          { title: 'Promise', path: '/front-end/promise' }
        ]
      }]
    }
  },
  base: '/psychosphere/',
}
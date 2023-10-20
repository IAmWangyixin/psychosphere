module.exports = {
  title: '竹子',
  description: '竹子的博客',
  theme: 'reco',
  themeConfig: {
    subSidebar: 'auto',
    nav: [
      { text: '首页', link: '/' },
      { text: 'Lexical', link: '/lexical/' },
      { text: '前端', link: '/front-end/' },
      { text: '导航', link: '/guide/' },
      { text: 'Github', link: 'https://github.com/ninawangyimei' },
      {
        text: '了解更多',
        items: [
          { text: '掘金', link: '#' },
          { text: '微信公众号', link: '#' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          title: '前端导航',
          link: '/guide/',
          collapsable: false,
          children: [{ title: '导航', path: '/guide/' }],
        },
      ],
      '/lexical/': [
        {
          title: 'Lexical 中文文档',
          path: '/lexical/',
          collapsable: false,
          children: [
            {
              title: '简介',
              path: '/lexical/',
            },
            {
              title: '文档',
              path: '/lexical/docs/introduction',
              children: [
                {
                  title: '入门',
                  path: '/lexical/docs/gettingStarted/gettingStartedWithReact.md',
                },
                {
                  title: '概念',
                  path: '/lexical/docs/concepts/node.md',
                  collapsable: true,
                  children: [
                    {
                      title: '节点',
                      path: '/lexical/docs/concepts/node.md',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      '/front-end/': [
        {
          title: 'Javascript',
          path: '/front-end/js/javascript',
          collapsable: false,
          children: [
            {
              title: 'JavaScript',
              path: '/front-end/js/javascript',
            },
            { title: 'Promise', path: '/front-end/js/promise' },
          ],
        },
      ],
    },
  },
  base: '/psychosphere/',
};

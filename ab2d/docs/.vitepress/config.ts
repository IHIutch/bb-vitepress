import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AB2D API',
  description: 'Medicare Parts A & B Claims Data for PDP Sponsors',
  ignoreDeadLinks: true,

  rewrites: {
    'get-started/try-the-sandbox': 'quickstart',
    'get-started/go-to-production': 'production/',
    'get-started/attest-and-onboard': 'guide/attest-and-onboard',
    'get-started/': 'guide/',
    'about-the-data': 'about/',
    'help': 'support',
  },

  themeConfig: {
    nav: [
      { text: 'About', link: '/about/' },
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api-reference/' },
      { text: 'Data Dictionary', link: '/data-dictionary/' },
      { text: 'Production', link: '/production/' },
      { text: 'Support', link: '/support' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Prerequisites', link: '/guide/' },
            { text: 'Attest & Onboard', link: '/guide/attest-and-onboard' },
          ],
        },
      ],

      '/api-reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api-reference/' },
          ],
        },
      ],

      '/data-dictionary/': [
        {
          text: 'Data Dictionary',
          items: [
            { text: 'Overview', link: '/data-dictionary/' },
          ],
        },
      ],

      '/production/': [
        {
          text: 'Production',
          items: [
            { text: 'Overview', link: '/production/' },
          ],
        },
      ],

      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quickstart', link: '/quickstart' },
          ],
        },
        {
          text: 'Resources',
          items: [
            { text: 'Support', link: '/support' },
          ],
        },
      ],
    },

    outline: {
      level: [2, 3],
    },

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/CMSgov/ab2d' },
    ],
  },
})

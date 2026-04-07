import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DPC API',
  description: 'Medicare Claims Data for Providers at the Point of Care',
  ignoreDeadLinks: true,

  rewrites: {
    'guide/first-request': 'quickstart',
    'guide/go-to-production': 'production/',
    'guide/api-reference': 'api-reference/',
    'terms-of-service': 'production/terms-of-service',
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
      '/about/': [
        {
          text: 'About',
          items: [
            { text: 'Overview', link: '/about/' },
            { text: 'Understand the Data', link: '/about/understand-the-data' },
          ],
        },
      ],

      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Overview', link: '/guide/' },
            { text: 'Set Up Your Environment', link: '/guide/setup' },
            { text: 'Build Your Integration', link: '/guide/build-integration' },
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
            { text: 'Terms of Service', link: '/production/terms-of-service' },
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
      { icon: 'github', link: 'https://github.com/CMSgov/dpc-app' },
    ],
  },
})

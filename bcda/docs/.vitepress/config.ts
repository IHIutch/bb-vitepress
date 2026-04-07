import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'BCDA API',
  description: 'Bulk Medicare Claims Data for ACO Model Entities',
  ignoreDeadLinks: true,

  rewrites: {
    'evaluate/:path*': 'about/:path*',
    'guide/quickstart': 'quickstart',
    'guide/endpoints/:path*': 'api-reference/:path*',
    'guide/data-model/:path*': 'data-dictionary/:path*',
    'production-access': 'production/',
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
      { text: 'Announcements', link: '/announcements/' },
    ],

    sidebar: {
      '/about/': [
        {
          text: 'About',
          items: [
            { text: 'Overview', link: '/about/' },
            { text: 'What Data You\'ll Get', link: '/about/what-data' },
            { text: 'Data Freshness', link: '/about/data-freshness' },
            { text: 'BCDA vs CCLF', link: '/about/bcda-vs-cclf' },
            { text: 'Use Cases', link: '/about/use-cases' },
          ],
        },
      ],

      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Overview', link: '/guide/' },
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Filtering', link: '/guide/filtering' },
            { text: 'Errors & Troubleshooting', link: '/guide/errors' },
          ],
        },
        {
          text: 'Migration',
          collapsed: true,
          items: [
            { text: 'v1 to v2', link: '/guide/migration/v1-to-v2' },
            { text: 'v2 to v3', link: '/guide/migration/v2-to-v3' },
          ],
        },
      ],

      '/api-reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api-reference/' },
            { text: '/Group', link: '/api-reference/group' },
            { text: '/Patient', link: '/api-reference/patient' },
            { text: '/jobs', link: '/api-reference/jobs' },
            { text: '/attribution_status', link: '/api-reference/attribution-status' },
            { text: '/metadata', link: '/api-reference/metadata' },
          ],
        },
      ],

      '/data-dictionary/': [
        {
          text: 'Data Dictionary',
          items: [
            { text: 'Resource Types', link: '/data-dictionary/' },
            { text: 'Dictionary & Sample Files', link: '/data-dictionary/dictionary' },
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
      { icon: 'github', link: 'https://github.com/CMSgov/bcda-app' },
    ],
  },
})

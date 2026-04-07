import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Blue Button API',
  description: 'Build apps with Medicare claims data for over 64 million people with Medicare.',
  ignoreDeadLinks: true,

  rewrites: {
    'guides/:path*': 'guide/:path*',
    'why-blue-button': 'about/',
    'use-cases': 'about/use-cases',
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
            { text: 'Why Blue Button', link: '/about/' },
            { text: 'Use Cases', link: '/about/use-cases' },
          ],
        },
      ],

      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Overview', link: '/guide/' },
            { text: 'Authentication & OAuth', link: '/guide/authentication-and-oauth' },
            { text: 'Fetching Patient Data', link: '/guide/fetching-patient-data' },
            { text: 'Working with Claims', link: '/guide/working-with-claims' },
            { text: 'Handling Pagination', link: '/guide/handling-pagination' },
            { text: 'Building a Consent Flow', link: '/guide/building-a-consent-flow' },
            { text: 'Going to Production', link: '/guide/going-to-production' },
          ],
        },
      ],

      '/api-reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api-reference/' },
            { text: 'Patient', link: '/api-reference/patient' },
            { text: 'Coverage', link: '/api-reference/coverage' },
            { text: 'ExplanationOfBenefit', link: '/api-reference/explanation-of-benefit' },
            { text: 'UserInfo', link: '/api-reference/userinfo' },
          ],
        },
      ],

      '/data-dictionary/': [
        {
          text: 'Data Dictionary',
          items: [
            { text: 'Overview', link: '/data-dictionary/' },
            { text: 'Code Systems', link: '/data-dictionary/code-systems' },
            { text: 'Identifiers', link: '/data-dictionary/identifiers' },
            { text: 'Variables', link: '/data-dictionary/variables' },
          ],
        },
      ],

      '/production/': [
        {
          text: 'Production',
          items: [
            { text: 'Overview', link: '/production/' },
            { text: 'Requirements', link: '/production/requirements' },
            { text: 'Terms of Service', link: '/production/terms-of-service' },
            { text: 'Application Review', link: '/production/application-review' },
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
            { text: 'Changelog', link: '/changelog' },
            { text: 'Support', link: '/support' },
          ],
        },
      ],
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/IHIutch/bb-vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/IHIutch/bb-vitepress' },
    ],
  },
})

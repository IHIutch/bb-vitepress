import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Blue Button API',
  description: 'Build apps with Medicare claims data for over 64 million people with Medicare.',
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Quickstart', link: '/quickstart' },
      { text: 'Guides', link: '/guides/' },
      { text: 'API Reference', link: '/api-reference/' },
      { text: 'Data Dictionary', link: '/data-dictionary/' },
      { text: 'Production', link: '/production/' },
    ],

    sidebar: {
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Overview', link: '/guides/' },
            { text: 'Authentication & OAuth', link: '/guides/authentication-and-oauth' },
            { text: 'Fetching Patient Data', link: '/guides/fetching-patient-data' },
            { text: 'Working with Claims', link: '/guides/working-with-claims' },
            { text: 'Handling Pagination', link: '/guides/handling-pagination' },
            { text: 'Building a Consent Flow', link: '/guides/building-a-consent-flow' },
            { text: 'Going to Production', link: '/guides/going-to-production' },
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
            { text: 'Why Blue Button', link: '/why-blue-button' },
            { text: 'Quickstart', link: '/quickstart' },
            { text: 'Use Cases', link: '/use-cases' },
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

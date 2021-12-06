// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Arno Cellarier',
  siteDescription: 'Write a description here',
  siteUrl: '//arnocellarier.fr',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'projects/**/*.md',
        typeName: 'Project',
        refs: {
          dependencies: {
            typeName: 'Dependency',
            create: true
          }
        }
      }
    }
  ],
  templates: {
    Project: '/project/:path'
  },
  transformers: {
    remark: {
      autolinkClassName: 'icon icon-link heading-anchor',
      externalLinksTarget: '_blank',
      externalLinksRel: ['noopener', ],
      anchorClassName: 'icon icon-link'
    }
  }
}

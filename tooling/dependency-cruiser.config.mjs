export default {
  forbidden: [
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
    {
      name: 'components-must-not-import-features',
      severity: 'error',
      from: { path: '^src/components/' },
      to: { path: '^src/features/' },
    },
    {
      name: 'ui-must-not-import-project-layers',
      severity: 'error',
      from: { path: '^src/ui/' },
      to: { path: '^src/(features|components|routes|lib)/' },
    },
    {
      name: 'features-must-not-import-routes',
      severity: 'error',
      from: { path: '^src/features/' },
      to: { path: '^src/routes/' },
    },
    {
      name: 'utils-must-not-import-project-layers',
      severity: 'error',
      from: { path: '^src/utils/' },
      to: { path: '^src/(lib|ui|components|features|routes)/' },
    },
    {
      name: 'lib-must-not-import-ui-or-product-layers',
      severity: 'error',
      from: { path: '^src/lib/' },
      to: { path: '^src/(ui|components|features|routes)/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules|src/routeTree\\.gen\\.ts' },
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    preserveSymlinks: false,
  },
};

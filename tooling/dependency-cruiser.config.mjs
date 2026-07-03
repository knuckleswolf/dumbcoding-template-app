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
      name: 'ui-must-not-import-product-layers',
      severity: 'error',
      from: { path: '^src/ui/' },
      to: { path: '^src/(features|components|routes)/' },
    },
    {
      name: 'features-must-not-import-routes',
      severity: 'error',
      from: { path: '^src/features/' },
      to: { path: '^src/routes/' },
    },
    {
      name: 'lib-must-not-import-product-ui-or-routes',
      severity: 'error',
      from: { path: '^src/lib/' },
      to: { path: '^src/(components|features|routes)/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules|src/routeTree\\.gen\\.ts' },
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    preserveSymlinks: false,
  },
};

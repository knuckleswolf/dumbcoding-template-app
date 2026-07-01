export default {
  forbidden: [{ name: 'no-circular', severity: 'error', from: {}, to: { circular: true } }],
  options: {
    doNotFollow: { path: 'node_modules|src/routeTree\\.gen\\.ts' },
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    preserveSymlinks: false,
  },
};

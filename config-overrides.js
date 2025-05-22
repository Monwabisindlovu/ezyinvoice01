module.exports = function override(config, env) {
  const sourceMapLoader = config.module.rules.find(rule =>
    rule.oneOf
  ).oneOf.find(
    r => r.loader && r.loader.includes('source-map-loader')
  );

  if (sourceMapLoader) {
    sourceMapLoader.exclude = /node_modules\/react-datepicker/;
  }

  return config;
};

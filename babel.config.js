module.exports = function (api) {
  const isProd = api.env('production')
  return {
    presets: [],
    plugins: [
      ...(isProd ? ['transform-remove-console'] : [])
    ]
  }
} 
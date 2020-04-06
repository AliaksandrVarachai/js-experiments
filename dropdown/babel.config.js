module.exports = function(api) {
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      [
        'react-css-modules',
        {
          generateScopedName: api.env('production')
            ? '[hash:base64]'
            : '[name]__[local]__[hash:base64:5]',
          filetypes: {
            '.pcss': {
              syntax: 'postcss-scss'
            }
          }
        }
      ],
      '@babel/plugin-proposal-class-properties'
    ]
  };
};

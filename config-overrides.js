const { injectBabelPlugin } = require('react-app-rewired');
const rewireSass = require('react-app-rewire-scss');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd-mobile', style: 'css' }], config);
    config = rewireSass(config, env);
    return config;
};
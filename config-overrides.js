// Allow us to change the webpack config without ejecting
// NOTE: Now using react-app-rewired instead of react-scripts in package.json
const { injectBabelPlugin } = require('react-app-rewired');

// Config Changes/Plugins
const rewireMobx = require('react-app-rewire-mobx');

module.exports = function override(config, env) {
	// Example plugin inject
	// config = injectBabelPlugin('plugin-name', config);

	config = rewireMobx(config, env);
	
	return config;
};
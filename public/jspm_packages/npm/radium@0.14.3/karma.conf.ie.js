/* */ 
module.exports = function(config) {
  require('./karma.conf')(config);
  config.set({
    plugins: config.plugins.concat('karma-ie-launcher'),
    browsers: ['IE9'],
    customLaunchers: {IE9: {
        base: 'IE',
        'x-ua-compatible': 'IE=EmulateIE9'
      }}
  });
};

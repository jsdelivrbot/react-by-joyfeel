/* */ 
module.exports = function(config) {
  require('./karma.conf')(config);
  config.set({coverageReporter: {reporters: [{type: 'text'}, {
        type: 'lcovonly',
        subdir: '.'
      }]}});
};

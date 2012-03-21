var Hook = require('hook.io').Hook
  , util = require('util')
  , NPM = require('npm-updates')
  ;


var NPMHook = module.exports = function (options) {

  var self = this;
  Hook.call(this, options);
  
  this.on('hook::ready', function () {
    var npm = new NPM(options);

    // proxy events to hook
    var events = ['change', 'update', 'publish', 'delete', 'new'];
    events.forEach(function(event) {
      npm.on(event, self.emit.bind(self, event));
    });

    npm.on('error', function(err) {
      self.emit('error::request', err.message);
    });

  });
};
module.exports.NPMHook = NPMHook;

//
// Inherit from `hookio.Hook`
//
util.inherits(NPMHook, Hook);

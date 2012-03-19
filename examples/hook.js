var NPMHook = require('..').NPMHook;
var hook = new NPMHook();

hook.on('update', function(info) {
  console.log('\nupdate:', info.name + '@' + info.version, new Date());
});

hook.on('new', function(info) {
  console.log('\nnew:', info.name + '@' + info.version, new Date());
});

hook.start();

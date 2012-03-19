var NPMHook = require('..')
  , assert = require('assert')
  , path = require('path')
  , nock = require('nock')
  ;


describe('hook.io-npm', function() {
  var hook = new NPMHook()
    , changes = 0
    , news = 0
    , updated = 0
    , published = 0
    , deleted = 0
    ;

  // mock all requests to the registry
  nock('http://isaacs.ic.ht')
    .get('/registry/_changes?feed=continuous&since=1')
    .replyWithFile(200, path.join(__dirname, 'assets', 'changes1.json'));

  nock('http://isaacs.ic.ht')
    .get('/registry/_changes?feed=continuous&since=50')
    .replyWithFile(200, path.join(__dirname, 'assets', 'changes2.json'));

  nock('http://isaacs.ic.ht')
    .get('/registry/newsemitter')
    .reply(200, {"dist-tags": {"latest": "0.1.0"},"versions":{"0.1.0":{}}});

  nock('http://isaacs.ic.ht')
    .get('/registry/chain-tiny')
    .reply(200, {"dist-tags": {"latest": "0.2.0"},"versions":{"0.2.0":{},"0.1.0":{}}});

  hook.on('change', function(obj) {
    changes++;
  });

  hook.on('new', function(info) {
    news++;
  });

  hook.on('update', function(info) {
    updated++;
  });

  hook.on('publish', function() {
    if (++published === 2) {
      hook.emit('done');
    }
  });

  hook.on('delete', function(name) {
    deleted++;
  });

  it('Events from `npm-updates` are proxied', function(done) {
    hook.on('done', function() {
      assert.equal(changes, 2);
      assert.equal(news, 1);
      assert.equal(updated, 1);
      assert.equal(published, 2);
      assert.equal(deleted, 0);
      done();
    });
    hook.start();
  });
});

//----------------------------------------------------------------------
// ar-hello0 -- even tinier hello world
// minimal off/on, turns motors off and on without launching
//----------------------------------------------------------------------

arDrone = require('/Users/mh/nodejs/lib/node_modules/ar-drone');

var client  = arDrone.createClient();

client.takeoff();

client
  .after(3000, function() {
    this.stop();
    this.land();
  });

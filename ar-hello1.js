//----------------------------------------------------------------------
// ar-hello1 -- hello world
// minimal demo program provided with ardrone package.
// lift off, turn, and land.
//----------------------------------------------------------------------

var arDrone = require('/Users/mh/nodejs/lib/node_modules/ar-drone');

var client  = arDrone.createClient();

client.takeoff();

client
  .after(5000, function() {
    this.clockwise(0.5);
  })
  .after(2000, function() {
    this.stop();
    this.land();
  });

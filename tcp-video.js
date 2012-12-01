var TcpVideoStream = require('/Users/mh/nodejs/lib/node_modules/ar-drone/lib/video/TcpVideoStream');

var video = new TcpVideoStream();

console.log('Connecting ...');
video.connect(function(err) {
  if (err) throw err;

  console.log('Connected');
});

video.on('data', console.log);


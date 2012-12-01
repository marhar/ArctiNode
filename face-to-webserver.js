arDrone = require('/Users/mh/nodejs/lib/node_modules/ar-drone');
cv=require('/Users/mh/nodejs/lib/node_modules/opencv')
fs=require('fs')

http = require('http');

var pngStream = arDrone.createPngStream();

var lastPng;
var facePng;

pngStream
  .on('error', console.log)
  .on('data', function(pngBuffer) {
    lastPng = pngBuffer;
  });

var server = http.createServer(function(req, res) {
  if (!lastPng) {
    res.writeHead(503);
    res.end('Did not receive any png data yet.');
    return;
  }

  res.writeHead(200, {'Content-Type': 'image/png'});
  fs.writeFile('/tmp/fakeface.png', lastPng, function(error) {

  cv.readImage('/tmp/fakeface.png', function(err, im){
    im.detectObject("/Users/mh/nodejs/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml", {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
      var x = faces[i]
      im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
    }
    facePng = im;
    im.save('/tmp/foundface.png');
    });
  });
});

  res.end(lastPng);
});

server.listen(8080, function() {
  console.log('Serving latest png on port 8080 ...');
});





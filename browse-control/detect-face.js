//
// this reads fin, does face detection, and writes to fout
//

var cv=require('/Users/mh/nodejs/lib/node_modules/opencv')

var fin=process.argv[2];
var fout=process.argv[3];

cv.readImage(fin, function(err, im){
  im.detectObject("/Users/mh/nodejs/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml", {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
      var x = faces[i]
      im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      if(i==0) console.log('found '+x.x+' '+x.y);
    }
    im.save(fout);
  });
})


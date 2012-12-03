//
// this reads fin, does face detection, and writes to fout
//

var cv=require('/Users/mh/nodejs/lib/node_modules/opencv')

var fin=process.argv[2];
var fout=process.argv[3];
var returnStr=fout;
hfile="/Users/mh/nodejs/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml";

var biggest=0;

cv.readImage(fin, function(err, im){
  im.detectObject(hfile, {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
      var x = faces[i]
      im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
      if(biggest < x.width + x.height) {
          biggest = x.width + x.height;
          returnStr='found '+x.x+' '+x.y+' '+fout;
      }
    }
    im.save(fout);
    console.log(returnStr);
  });
})


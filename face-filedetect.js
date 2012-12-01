cv=require('/Users/mh/nodejs/lib/node_modules/opencv')
cv.readImage("./face-andreas.png", function(err, im){
  im.detectObject("/Users/mh/nodejs/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml", {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
      var x = faces[i]
      im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
    }
    im.save('./out.jpg');
  });
})


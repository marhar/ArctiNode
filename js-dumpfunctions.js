cv=require('/Users/mh/nodejs/lib/node_modules/opencv')
cv.readImage("./face-andreas.png", function(err, im){

  var pp=
  "/Users/mh/nodejs/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml";
  im.detectObject(pp, {}, function(err, faces){
    var bar;

    for (bar in im)
    {
        console.log("im has property " + bar);
    }

    for (bar in cv)
    {
        console.log("cv has property " + bar);
    }

    for (bar in cv.Matrix)
    {
        console.log("cv.Matrix has property " + bar);
    }
    console.log("typeof cv: "+typeof(cv));

  });
})


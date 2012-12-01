cv=require('/Users/mh/nodejs/lib/node_modules/opencv')
cv.readImage("./face-andreas.png", function(err, im){

  var pp=
  "/Users/mh/nodejs/share/OpenCV/haarcascades/haarcascade_frontalface_alt.xml";
  im.detectObject(pp, {}, function(err, faces){
    for (var i=0;i<faces.length; i++){
      var x = faces[i]
      //im.ellipse(x.x + x.width/2, x.y + x.height/2, x.width/2, x.height/2);
    }

    var minval;
    var maxval;
    var minloc;
    var maxloc;

    //im.cvMinMaxLoc(minval,maxval,minloc,maxloc);
    //im.cvThreshold();

    console.log("width: "+im.width());
    console.log("height: "+im.height());

    var maxx = im.width();
    var maxy = im.height();
    var x;
    var y;
    var brightx=0;
    var brighty=0;
    var avgx=0;
    var avgy=0;
    var npoints=0;
    var vv;
    var brightpoint=im.get(0,0);

    var bar;

    //im.convertGrayscale();

    for (x = 0; x < maxx; ++x) {
        for (y = 0; y < maxy; ++y) {

            vv=im.get(x,y);


            var b0 = ((vv >> (8 * 0)) & 0xff);
            var b1 = ((vv >> (8 * 1)) & 0xff);
            var b2 = ((vv >> (8 * 2)) & 0xff);

            var vvc = b0 + b1 + b2;

            console.log('vvc: '+vv+' '+(vv << 0)+' '+b0+' '+b1+' '+b2+' '+vvc);
            if (vvc >= brightpoint) {
                brightx = x;
                brighty = y;
                avgx += x;
                avgy += y;
                npoints += 1;
                brightpoint=vvc;
                im.ellipse(brightx - 2, brighty - 2, 4, 4);
            }
        }
    }

    console.log('avgx: '+avgx);
    console.log('avgy: '+avgy);
    console.log('npoints: '+npoints);

    avgx = avgx / npoints;
    avgy = avgy / npoints;

    console.log('avgx: '+avgx);
    console.log('avgy: '+avgy);

    im.ellipse(avgx - 10, avgy - 10, 20, 20);

    console.log("im.channels(): "+im.channels());
    //im.findContours();
    im.save('./out.jpg');
  });
})


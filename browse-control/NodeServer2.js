var sys = require("sys");  
var http = require("http");  
var url = require("url");  
var path = require("path");  
var fs = require("fs"); 
var arDrone = require('/Users/mh/nodejs/lib/node_modules/ar-drone');

var drone  = arDrone.createClient();
var pngStream;
var lastPng;
var facePng;

var setPoint=1;
var processVariable=0;

var processVariableDeltaSim=0;
var outValue=0;
 

var spFunc = function getSetPoint() // target
{
  return setPoint;
} 

var pvFunc = function getProcessVariable() // current
{
  processVariable+=(processVariableDeltaSim*outValue);
  return processVariable;
} 

var outFunc = function setOutput(value) // output
{
  outValue=value;
  console.log("out: "+value+" pv: "+processVariable);
}                     

var callComputeFunc = function callCompute()
{
  pid.compute();
}

function PID_Controller(pG, iG, dG, pMax, pMin, oMax, oMin, pvFunc, spFunc, outFunc, interval) 
{  
  //Gains
  this.kp=pG;
  this.ki=iG;
  this.kd=dG;

  //Running Values
  this.lastUpdate=0;
  this.lastPV=0;
  this.errSum=0;

  //Reading/Writing Values
  this.readPV=pvFunc;
  this.readSP=spFunc;
  this.writeOV=outFunc;

  //Max/Min Calculation
  this.pvMax=pMax;
  this.pvMin=pMin;
  this.outMax=oMax;
  this.outMin=oMin;
  
  this.interval=interval;
  this.thread=null;
}
 
   
PID_Controller.prototype.enable = function()
{
  this.reset();
  this.thread=setInterval(callComputeFunc,this.interval);
}

PID_Controller.prototype.disable = function()
{
  clearInterval(this.thread);
  this.thread=null;
}

PID_Controller.prototype.reset = function()
{
  this.errSum = 0;
  this.lastUpdate = 0;
}  

PID_Controller.prototype.scaleValue = function(value, valuemin, valuemax, scalemin, scalemax)
{
  var vPerc = (value - valuemin) / (valuemax - valuemin);
  var bigSpan = vPerc * (scalemax - scalemin);
  var retVal = scalemin + bigSpan;
  return retVal;
}

PID_Controller.prototype.clamp = function(value, min, max)
{
 if (value > max)return max;
 if (value < min)return min;
 return value;
}

PID_Controller.prototype.compute = function()
{
  if (this.readPV == null || this.readSP == null || this.writeOV == null)return;

  var pv = this.readPV();
  var sp = this.readSP();

  //We need to scale the pv to +/- 100%, but first clamp it
  pv = this.clamp(pv, this.pvMin, this.pvMax);
  pv = this.scaleValue(pv, this.pvMin, this.pvMax, -1, 1);

  //We also need to scale the setpoint
  sp = this.clamp(sp, this.pvMin, this.pvMax);
  sp = this.scaleValue(sp, this.pvMin, this.pvMax, -1, 1);

  //Now the error is in percent...
  var err = sp - pv;

  var pTerm = err * this.kp;
  var iTerm = 0;
  var dTerm = 0;

  var partialSum = 0;
  var date = new Date();
  var nowTime = date.getTime(); 

  if (this.lastUpdate != 0)
  {
    var dT = nowTime - this.lastUpdate;

    //Compute the integral if we have to...
    if (pv >= this.pvMin && pv <= this.pvMax)
    {
      partialSum = this.errSum + dT * err;
      iTerm = this.ki * partialSum;
    }

    if (dT != 0)
   {
      dTerm = this.kd * (pv - this.lastPV) / dT;
   }
  }

  this.lastUpdate = nowTime;
  this.errSum = partialSum;
  this.lastPV = pv;

  //Now we have to scale the output value to match the requested scale
  var outReal = pTerm + iTerm + dTerm;

  outReal = this.clamp(outReal, -1, 1);
  outReal = this.scaleValue(outReal, -1, 1, this.outMin, this.outMax);

  //Write it out to the world
  this.writeOV(outReal);
  
  
  console.log("Time: "+this.lastUpdate+" Out: "+outReal+" Err: "+this.errSum);
}  

var pid=null;
   
//pid=new PID_Controller(0.1, 0,  0, 1,      -1,    1,   -1, pvFunc, spFunc, outFunc, 1000);

var count=100000;

var server=http.createServer(function (req, res) 
{
  var uri = url.parse(req.url).pathname;

  if(uri === "/state") 
  {
    sendState(req, res);
  }
  else if(uri === "/start") 
  {
    startAction(req, res);
  }
  else if(uri === "/stop") 
  {
    stopAction(req, res);
  }  
  else if(uri === "/setState") 
  {
    setState(req, res);
  }  
  else if(uri === "/takeoff") 
  {
    takeoffAction(req, res);
  }  
  else if(uri === "/land") 
  {
    landAction(req, res);
  }  
  else if(uri === "/freeze") 
  {
    freezeAction(req, res);
  }  
  else if(uri === "/yaw") 
  {
    yawAction(req, res);
  } 
  else if(uri === "/roll") 
  {
    rollAction(req, res);
  } 
  else if(uri === "/pitch") 
  {
    pitchAction(req, res);
  } 
  else if(uri === "/vertical") 
  {
    verticalAction(req, res);
  }   
  else if(uri === "/rc") 
  {
    rcAction(req, res);
  }   
  else if(uri === "/reset") 
  {
    resetAction(req, res);
  }
  else if(uri === "/startVideoStream")
  {
    console.log("startVideoStream");
    pngStream = arDrone.createPngStream();
    pngStream
      .on('error', console.log)
      .on('data', function(pngBuffer) {
         if(count%5==0)
         {
           lastPng = pngBuffer;
           fs.writeFile('camera.png', lastPng, function(error) {});
           fs.writeFile('camera_'+count+'.png', lastPng, function(error) {});
         }
         count++;
      }); 
  }   
  else
  {
    sendFile(uri,req, res);
  }

});

function freezeAction(req, res) 
{
  console.log("freezeAction");
  drone.stop();
  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()
}

function resetAction(req, res) 
{
  console.log("resetAction");
  drone.disableEmergency();
  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()
}

function rcAction(req, res) 
{  
  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()

  var data = '';
  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function() {
    var o = JSON.parse(data);

    console.log("rcAction yaw: "+o.yaw+" roll: "+o.roll+" pitch: "+o.pitch+" vertical: "+o.vertical);

    if(o.yaw>=0)
    {
      drone.clockwise(o.yaw);
    }
    else
    {
      drone.counterClockwise(-1*o.yaw);
    }

    if(o.roll>=0)
    {
      drone.right(o.roll);
    }
    else
    {
      drone.left(-1*o.roll);
    }

    if(o.pitch>=0)
    {
      drone.front(o.pitch);
    }
    else
    {
      drone.back(-1*o.pitch);
    }

    if(o.vertical>=0)
    {
      drone.up(o.vertical);
    }
    else
    {
      drone.down(-1*o.vertical);
    }

    res.writeHead(200, {'content-type': 'text/plain' });
    res.end()
  });
}


function yawAction(req, res) 
{  
  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()

  var data = '';
  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function() {
    var o = JSON.parse(data);

    console.log("yawAction value: "+o.value);

    if(o.value>=0)
    {
      drone.clockwise(o.value);
    }
    else
    {
      drone.counterClockwise(-1*o.value);
    }

    res.writeHead(200, {'content-type': 'text/plain' });
    res.end()
  });
}

function rollAction(req, res) 
{
  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()

  var data = '';
  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function() {
    var o = JSON.parse(data);

    console.log("rollAction o.value: "+o.value);

    if(o.value>=0)
    {
      drone.right(o.value);
    }
    else
    {
      drone.left(-1*o.value);
    }

    res.writeHead(200, {'content-type': 'text/plain' });
    res.end()
  });
}

function pitchAction(req, res) 
{
  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()
  
  var data = '';
  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function() {
    var o = JSON.parse(data);
  
    console.log("pitchAction o.value: "+o.value);
  
    if(o.value>=0)
    {
      drone.front(o.value);
    }
    else
    {
      drone.back(-1*o.value);
    }
  
    res.writeHead(200, {'content-type': 'text/plain' });
    res.end()
  });
}

function verticalAction(req, res) 
{
  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()
  
  var data = '';
  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function() {
    var o = JSON.parse(data);
  
    console.log("verticalAction o.value: "+o.value);
  
    if(o.value>=0)
    {
      drone.up(o.value);
    }
    else
    {
      drone.down(-1*o.value);
    }
  
  
    res.writeHead(200, {'content-type': 'text/plain' });
    res.end()
  });
}

function takeoffAction(req, res) 
{
  console.log("takeoffAction");
  drone.takeoff();

  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()
}

function landAction(req, res) 
{
  console.log("landAction");
  drone.land();

  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()
}

function stopAction(req, res) 
{
  if(pid!=null)
  {
    pid.disable();
  }

  console.log("stopAction");


  res.writeHead(200, {'content-type': 'text/plain' });
  res.end()
}

function startAction(req, res) 
{  
  var data = '';
  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function() {
    var o = JSON.parse(data);
    pid=new PID_Controller(o.pG, o.iG, o.dG, o.pMax, o.pMin, o.oMax, o.oMin, pvFunc, spFunc, outFunc, o.interval);

    setPoint=o.sp;
    processVariable=o.pv;
    processVariableDeltaSim=o.pvDelta;

    console.log("startAction p gain: "+pid.kp);

    pid.enable();

    res.writeHead(200, {'content-type': 'text/plain' });
    res.end()
  });
}

function setState(req, res) 
{  
  var data = '';
  req.addListener('data', function(chunk) { data += chunk; });
  req.addListener('end', function() {
    var o = JSON.parse(data);

    setPoint=o.sp;
    processVariable=o.pv;
    processVariableDeltaSim=o.pvDelta;

    console.log("setState setPoint: "+setPoint);

    res.writeHead(200, {'content-type': 'text/plain' });
    res.end()
  });
}

function sendState(req, res) 
{  
  res.writeHead(200, { "Content-Type" : "text/plain" });  
  
  var obj=new Object();
  obj.pv=processVariable, 
  obj.out=outValue,  
  
  res.end(JSON.stringify(obj)); 
}

function sendFile(uri,req, res)
{
  var filename = path.join(process.cwd(), uri);  
  fs.exists(filename, function(exists) 
  {  
    if(!exists) 
    {  
      res.writeHead(404, {"Content-Type": "text/plain"});  
      res.end("404 Not Found\n");  
    }
    else
    {
      fs.readFile(filename, "binary", function(err, file) 
      {  
        if(err) 
        {  
          res.writeHead(500, {"Content-Type": "text/plain"});  
          res.end(err + "\n");  
        }
        else
        {
         res.writeHead(200);  
         res.end(file, "binary");  
        }
      });  
    }
  });  
}


server.listen(8888, '127.0.0.1');


console.log('Server running at http://127.0.0.1:8888/');

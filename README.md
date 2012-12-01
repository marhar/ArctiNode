droneolympics
=============

EastBay RC Drone Olympics Stuff.  This is a thing we put
together for the SF droneolympics.com.  We'll tidy up
after the contest.

Title
-----

ArctiNode -- Web-page based ar.drone control, video capture and navigation.


Team
----

Team EastBay RC

Mark Harrison  (mh@pixar.com)
Andreas Oesterer (oesterer@gmail.com)
http://eastbay-rc.blogspot.com

Description
-----------

ArctiNode is a node.js application for controlling an
ar.drone via a web browser.

Commands directly supported: Takeoff, Land, Freeze,
Reset Emergency Mode, Start Video Stream

Dual HTML 5 virtual joystick controller interface.  The controls
are like traditional RC transmitters:  left stick controls altitude
and yaw (rotation), right stick controls motion
(left/right/forwards/backwards).

Video Capture.  Video frames from the ar.drone are captured
to the host computer and displayed in the browser.

Facial Recognition.  Frames captured are sent to OpenCV for
facial recognition.

Light Recognition.  Recognizes a light source such as a
flashlight or laser pointer. [incomplete -- having problems
extracting R/G/B channels from video stream]

PID controller.  A general purpose feedback control loop for smoothly
controlling ar.drone motion.  Can be used for other applications
that need a PID controller.  A PID testbed is included.

Facial Following.  The drone will turn to point to anything that it
recognizes as a face.  The facial recognizer calculates how far
away the face is from being centered, and feeds that value as
the error value to the PID controller, which then rotates the
ar.drone.  For safety's sake the ar.drone does not move towards
the face. [incomplete -- we will try to hook this up during the
contest.]

Drone Following. The ar.drone will hover over another unit and
track it's movements using an LED beacon attached to the other
unit [incomplete: depends on Light Recognition and downward
facing video capture as noted above and below.]

Of course, a Unix command line interface with convenient
vi-compatible mnemonics is also provided for those
who prefer flying aircraft the old fashioned way.

Things we are looking for help with.  Any assistance much appreciated!

- Video stream consists of 3 8-bit channels packed into 4 bytes
  and cast into floating point.  How can we extract these 3
  values from the floating point value returned to javascript?

- How can we call the OpenCV threshold functions?

- Capturing video at too high a frame rate causes node.js errors.

- Is there an existing ardrone call to stream video from the
  downward-facing camera?  There's a low-level command documented
  in the Parrot reference.

Installation Notes
------------------

NODEJS

  - node-v0.8.15.tar.gz
  - configure --prefix=/Users/mh/nodejs
  - make; make install

OPENCV

  - OpenCV-2.3.1a.tar.bz2, as per nodejs opencv docs
  - edit CMakeLists.txt 
  - ## change /usr/local to /Users/mh/nodejs
  - cmake -G "Unix Makefiles"; make; make install
  - export DYLD_LIBRARY_PATH=/Users/mh/nodejs/lib

ARDRONE

  - npm install git://github.com/felixge/node-ar-drone.git -g

NODEJS OPENCV

  - ## https://github.com/peterbraden/node-opencv
  - ## requires OpenCV 2.3.1
  - npm install opencv -g
  - ?? export PKG_CONFIG_PATH=/Users/mh/nodejs/lib/pkgconfig

ENV

  - export DYLD_LIBRARY_PATH=/Users/mh/nodejs/lib
  - export PATH=/Users/mh/nodejs/bin:$PATH
  - ?? export PKG_CONFIG_PATH=/Users/mh/nodejs/lib/pkgconfig

droneolympics
=============

EastBay RC Drone Olympics Stuff



Installation Notes



NODEJS
    node-v0.8.15.tar.gz
    configure --prefix=/Users/mh/nodejs
    make; make install

OPENCV
  OpenCV-2.3.1a.tar.bz2, as per nodejs opencv docs
  edit CMakeLists.txt 
  ## change /usr/local to /Users/mh/nodejs
  cmake -G "Unix Makefiles"; make; make install
  export DYLD_LIBRARY_PATH=/Users/mh/nodejs/lib

ARDRONE
  npm install git://github.com/felixge/node-ar-drone.git -g

NODEJS OPENCV

  ## https://github.com/peterbraden/node-opencv
  ## requires OpenCV 2.3.1
  npm install opencv -g
  ?? export PKG_CONFIG_PATH=/Users/mh/nodejs/lib/pkgconfig

ENV
  export DYLD_LIBRARY_PATH=/Users/mh/nodejs/lib
  export PATH=/Users/mh/nodejs/bin:$PATH
  ?? export PKG_CONFIG_PATH=/Users/mh/nodejs/lib/pkgconfig

PROGRAMS

ardemo1.js
ardemo2.js

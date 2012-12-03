
/takeoff
/land
/freeze
/yaw
/roll
/pitch
/vertical
/rc
/reset
/startVideoStream

H=http://localhost:8888

alias a="curl >/dev/null -s $H/takeoff"
alias zz="curl >/dev/null -s $H/land"
alias a="curl >/dev/null -s $H/freeze"

alias a="curl >/dev/null -s $H/yaw; sleep 1; curl >/dev/null -s $H/yaw"
alias a="curl >/dev/null -s $H/roll"
alias a="curl >/dev/null -s $H/pitch"
alias a="curl >/dev/null -s $H/vertical"

alias help='cat <<.
arctinode controls
a : takeoff
b : land
j : lower
k : higher
h : left
l : right
f : forward
b : backward
.

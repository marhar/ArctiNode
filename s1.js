var i, a, b, c, max;
max = 1000000000;
var d = Date.now();
for (i = 0; i < max; i++) {
    a = 1234 + 5678 + i;
    b = 1234 * 5678 + i;
    c = 1234 / 2 + i;
}
console.log(Date.now() - d);

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setInterval = setInterval;
exports.clearInterval = clearInterval;

function each(arr, fn) {
  arr.forEach(fn);
}

var now = Date.now;
var rfa = requestAnimationFrame || function (fn) {
  setTimeout(fn, 1000 / 60);
};

var queue = [];
var id = -1;
var ticking = false;
var tickId = null;
var lastTime = 0;

function setInterval(fn, interval) {
  id++;
  queue.push({ id: id, fn: fn, interval: interval, lastTime: now() });

  if (!ticking) {
    var tick = function tick() {
      tickId = rfa(tick);

      each(queue, function (item) {
        if (item.interval < 17 || now() - item.lastTime >= item.interval) {
          item.fn.call();
          item.lastTime = now();
        }
      });
    };

    ticking = true;
    tick();
  }

  return id;
}

function clearInterval(id) {
  for (var i = 0; i < queue.length; i++) {
    if (id === queue[i].id) {
      queue.split(i, 1);
      break;
    }
  }

  if (queue.length === 0) {
    ticking = false;
    clearTimeout(ticking);
  }
}
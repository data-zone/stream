
function each(arr, fn){
  arr.forEach(fn)
}

const now = Date.now;
const rfa = requestAnimationFrame || function (fn) {
  setTimeout(fn, 1000 / 60);
}

const queue = [];
let id = -1;
let ticking = false;
let tickId = null;
let lastTime = 0;

export function setInterval(fn, interval) {
  id++;
  queue.push({ id, fn, interval, lastTime: now() });

  if (!ticking) {
    const tick = function () {
      tickId = rfa(tick);

      each(queue, item => {
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

export function clearInterval(id) {
  for (let i = 0; i < queue.length; i++) {
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
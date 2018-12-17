export default function throttle(fn, delay) {
  var st
  delay = delay || 50

  return () => {
    var et = +new Date()
    if (!st || (et - st >= delay)) {
      st = et
      fn()
    }
  }
}

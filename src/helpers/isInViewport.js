function isCross(r1, r2) {
  var r = {};
  r.top = Math.max(r1.top, r2.top);
  r.bottom = Math.min(r1.bottom, r2.bottom);
  r.left = Math.max(r1.left, r2.left);
  r.right = Math.min(r1.right, r2.right);
  return r.bottom >= r.top && r.right >= r.left;
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function isInViewport(el, container, config) {
  var offsetConfig = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
  var contRect

  if (isObject(container)) {
    config = container
    container = null
  } else if (!config) {
    config = {}
  }


  Object.assign(offsetConfig, config)

  if (!container) {
    var width = (window.innerWidth || document.documentElement.clientWidth)
    var height = (window.innerHeight || document.documentElement.clientHeight)
    contRect = {
      top: 0,
      right: width,
      bottom: height,
      left: 0
    }
  } else {
    contRect = container.getBoundingClientRect()
  }

  contRect.top -= offsetConfig.top
  contRect.right += offsetConfig.right
  contRect.bottom += offsetConfig.bottom
  contRect.left -= offsetConfig.left

  return isCross(el.getBoundingClientRect(), contRect)
}


export default isInViewport

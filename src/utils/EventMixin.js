var EventMixin = {}

EventMixin.on = function (name, fn) {
    var listeners = getListeners(this)
    if (!listeners.has(name)) {
        listeners.set(name, new Set());
    }
    listeners.get(name).add(fn);
    return this;
}

EventMixin.off = function (name, fn) {
    var listeners = getListeners(this)
    listeners.get(name).delete(fn);
    return this;
}

EventMixin.fire = function (name, obj) {
    var listeners = getListeners(this)
    if (!listeners.has(name)) return
    listeners.get(name).forEach(function (fn) {
      fn(obj);
    })
	return this;
}

function getListeners (obj) {
    if (!obj._listeners) {
        obj._listeners = new Map()
    }
    return obj._listeners
}

function mixin (mixinObj, targetClass) {
    for (var prop in mixinObj) {
        targetClass.prototype[prop] = mixinObj[prop]
    }
}
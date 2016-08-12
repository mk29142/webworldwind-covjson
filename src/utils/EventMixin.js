/**
 * A mixin that encapsulates the use of multiple event listeners for
 * purposes such as load, onClick or change etc.
 * @callback requestCallback
 */

var EventMixin = {}

/**
 * Creates an event listener based on a name for a specific purpose
 * when it is activated using the fire method.
 * @param {String} name
 * @param {requestCallback} fn
 */
EventMixin.on = function (name, fn) {
    var listeners = getListeners(this)
    if (!listeners.has(name)) {
        listeners.set(name, new Set());
    }
    listeners.get(name).add(fn);
    return this;
}

/**
 * Deletes the listener and function associated with the given name
 * @param {String} name
 * @param {requestCallback} fn
 */
EventMixin.off = function (name, fn) {
    var listeners = getListeners(this)
    listeners.get(name).delete(fn);
    return this;
}

/**
 * Runs the function of the eventlistener specified by name
 * on the obj.
 * @param {String} name
 * @param {Object} obj
 */
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

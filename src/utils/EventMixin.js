var CJ360 = window.CJ360 || {};

/**
 * A mixin that encapsulates the use of multiple event listeners for
 * purposes such as load, onClick or change etc.
 * @callback requestCallback
 */

CJ360.EventMixin = {};

/**
 * Creates an event listener based on a name for a specific purpose
 * when it is activated using the fire method.
 * @param {String} name
 * @param {requestCallback} fn
 */
CJ360.EventMixin.on = function (name, fn) {
    var listeners = CJ360.getListeners(this);
    if (!listeners.has(name)) {
        listeners.set(name, new Set());
    }
    listeners.get(name).add(fn);
    return this;
};

/**
 * Deletes the listener and function associated with the given name
 * @param {String} name
 * @param {requestCallback} fn
 */
CJ360.EventMixin.off = function (name, fn) {
    var listeners = CJ360.getListeners(this);
    listeners.get(name).delete(fn);
    return this;
};

/**
 * Runs the function of the eventlistener specified by name
 * on the obj.
 * @param {String} name
 * @param {Object} obj
 */
CJ360.EventMixin.fire = function (name, obj) {
    var listeners = CJ360.getListeners(this);
    if (!listeners.has(name)) return;
    listeners.get(name).forEach(function (fn) {
      fn(obj);
    });
	return this;
};

CJ360.getListeners = function (obj) {
    if (!obj._listeners) {
        obj._listeners = new Map();
    };
    return obj._listeners;
};

/**
 * creates a prototype for all the functions in the EventMixin class
 * in the targetclass so that the target class can just call them i.e targetClass.on
 * targetClass.off or targetClass.fire
 * @param {Object} mixinObj
 * @param {Class} targetClass
 */
CJ360.mixin = function (mixinObj, targetClass) {
    for (var prop in mixinObj) {
        targetClass.prototype[prop] = mixinObj[prop];
    };
};

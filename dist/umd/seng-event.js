(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SengBoilerplate"] = factory();
	else
		root["SengBoilerplate"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var EventDispatcher_1 = __webpack_require__(2);
	var EventPhase_1 = __webpack_require__(6);
	exports.EventPhase = EventPhase_1.default;
	var EventListenerData_1 = __webpack_require__(5);
	exports.EventListenerData = EventListenerData_1.default;
	var CallListenerResult_1 = __webpack_require__(7);
	exports.CallListenerResult = CallListenerResult_1.default;
	var AbstractEvent_1 = __webpack_require__(8);
	exports.AbstractEvent = AbstractEvent_1.default;
	__webpack_require__(9);
	__webpack_require__(11);
	__webpack_require__(10);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EventDispatcher_1.default;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var seng_disposable_1 = __webpack_require__(3);
	var EventListenerData_1 = __webpack_require__(5);
	var EventDispatcher = (function (_super) {
	    __extends(EventDispatcher, _super);
	    function EventDispatcher(parent, target) {
	        if (parent === void 0) { parent = null; }
	        _super.call(this);
	        this._listeners = {};
	        this._target = target || this;
	        this.parent = parent;
	    }
	    EventDispatcher.prototype.dispatchEvent = function (event) {
	        if (this.isDisposed()) {
	        }
	        else {
	            // todo: on debug builds, check willTrigger and log if false
	            var callTree = exports.getCallTree(this, event.bubbles);
	            event.target = this._target;
	            event.eventPhase = callTree.length === 1 ? 2 /* AT_TARGET */ : 1 /* CAPTURING_PHASE */;
	            for (var i = 0; i < callTree.length; i++) {
	                var currentTarget = callTree[i];
	                event.currentTarget = currentTarget;
	                if (currentTarget === this) {
	                    event.eventPhase = 2 /* AT_TARGET */;
	                }
	                var propagationIsStopped = exports.callListeners(currentTarget._listeners, event);
	                if (propagationIsStopped) {
	                    event.eventPhase = 0 /* NONE */;
	                    break;
	                }
	                if (i === callTree.length - 1) {
	                    // after last target in tree, reset eventPhase to NONE
	                    event.eventPhase = 0 /* NONE */;
	                }
	                else if (currentTarget === this) {
	                    // after target === currentTarget we will enter the bubbling phase
	                    event.eventPhase = 3 /* BUBBLING_PHASE */;
	                }
	            }
	            event.currentTarget = null;
	            return event.defaultPrevented;
	        }
	        return false;
	    };
	    EventDispatcher.prototype.addEventListener = function (eventType, listener, useCapture, priority) {
	        if (useCapture === void 0) { useCapture = false; }
	        if (priority === void 0) { priority = 0; }
	        if (typeof (this._listeners[eventType]) === 'undefined') {
	            this._listeners[eventType] = [];
	        }
	        // todo: log in debug mode
	        var isDebugMode = false;
	        if (isDebugMode && this.hasEventListener(eventType, listener, useCapture)) {
	        }
	        // end todo
	        var data = new EventListenerData_1.default(this, eventType, listener, useCapture, priority);
	        this._listeners[eventType].push(data);
	        this._listeners[eventType].sort(this._listenerSorter);
	        return data;
	    };
	    EventDispatcher.prototype.hasEventListener = function (eventType, listener, useCapture) {
	        if (typeof listener === 'undefined') {
	            return this._listeners[eventType] && this._listeners[eventType].length > 0;
	        }
	        else if (!this._listeners[eventType]) {
	            return false;
	        }
	        else {
	            for (var i = 0; i < this._listeners[eventType].length; i++) {
	                var listenerData = this._listeners[eventType][i];
	                if (listenerData.listener === listener && (typeof useCapture === 'undefined' || useCapture === listenerData.useCapture)) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    };
	    EventDispatcher.prototype.willTrigger = function (eventType) {
	        return this.hasEventListener(eventType) || (this.parent && this.parent.willTrigger(eventType));
	    };
	    EventDispatcher.prototype.removeEventListener = function (eventType, listener, useCapture) {
	        if (useCapture === void 0) { useCapture = false; }
	        exports.removeListenersFrom(this._listeners, false, eventType, listener, useCapture);
	    };
	    EventDispatcher.prototype.removeAllEventListeners = function (eventType) {
	        exports.removeListenersFrom(this._listeners, true, eventType);
	    };
	    EventDispatcher.prototype.dispose = function () {
	        this.removeAllEventListeners();
	        _super.prototype.dispose.call(this);
	    };
	    EventDispatcher.prototype._listenerSorter = function (e1, e2) {
	        return e2.priority - e1.priority;
	    };
	    return EventDispatcher;
	}(seng_disposable_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EventDispatcher;
	exports.removeListenersFrom = function (listeners, removeAll, eventType, listener, useCapture) {
	    // build an array with arrays of events for each eventType we want to remove from
	    var removeFrom = [];
	    if (eventType) {
	        // eventType argument is set, just remove from this type
	        if ((eventType in listeners) && (listeners[eventType] instanceof Array)) {
	            removeFrom.push(listeners[eventType]);
	        }
	    }
	    else {
	        // eventType not set, add all event types with listeners
	        for (var i in listeners) {
	            if (listeners.hasOwnProperty(i) && listeners[i] instanceof Array) {
	                removeFrom.push(listeners[i]);
	            }
	        }
	    }
	    if (removeFrom.length) {
	        for (var i = 0; i < removeFrom.length; i++) {
	            var listenersForType = removeFrom[i];
	            for (var j = listenersForType.length; j; j--) {
	                var listenerData = listenersForType[j - 1];
	                if (removeAll || (listenerData.listener === listener && listenerData.useCapture === useCapture)) {
	                    listenersForType.splice(j - 1, 1);
	                    // mark the listener as removed, because it might still be active in the current event loop
	                    listenerData.isRemoved = true;
	                }
	            }
	        }
	    }
	    else {
	    }
	};
	exports.getCallTree = function (target, bubbles) {
	    var callTree = [];
	    var parents = exports.getParents(target);
	    for (var i = parents.length; i; i--) {
	        callTree.push(parents[i - 1]);
	    }
	    callTree.push(target);
	    if (bubbles) {
	        Array.prototype.push.apply(callTree, parents);
	    }
	    return callTree;
	};
	exports.getParents = function (target) {
	    var currentTarget = target;
	    var parents = [];
	    while (currentTarget.parent) {
	        currentTarget = currentTarget.parent;
	        parents.push(currentTarget);
	    }
	    return parents;
	};
	exports.callListeners = function (listeners, event) {
	    var listenersOfType = listeners[event.type] ? listeners[event.type].slice() : [];
	    var propagationIsStopped = false;
	    for (var i = 0; i < listenersOfType.length; i++) {
	        var disabledOnPhase = listenersOfType[i].useCapture ? 3 /* BUBBLING_PHASE */ : 1 /* CAPTURING_PHASE */;
	        if (event.eventPhase !== disabledOnPhase && !listenersOfType[i].isRemoved) {
	            var callResult = event.callListener(listenersOfType[i].listener);
	            if (callResult > 0 /* NONE */) {
	                propagationIsStopped = true;
	                if (callResult === 2 /* IMMEDIATE_PROPAGATION_STOPPED */) {
	                    break;
	                }
	            }
	        }
	    }
	    return propagationIsStopped;
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Disposable_1 = __webpack_require__(4);
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Disposable_1.default;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	var Disposable = (function () {
	    function Disposable() {
	        this._isDisposed = false;
	    }
	    /**
	     * After {@link dispose} has been called, this method returns true.
	     * Use this method to determine whether dispose() should be run again.
	     */
	    Disposable.prototype.isDisposed = function () {
	        return this._isDisposed;
	    };
	    /**
	     * Destruct this class.
	     */
	    Disposable.prototype.dispose = function () {
	        this._isDisposed = true;
	    };
	    return Disposable;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Disposable;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var seng_disposable_1 = __webpack_require__(3);
	var EventListenerData = (function (_super) {
	    __extends(EventListenerData, _super);
	    function EventListenerData(dispatcher, type, listener, useCapture, priority) {
	        _super.call(this);
	        this.dispatcher = dispatcher;
	        this.type = type;
	        this.listener = listener;
	        this.useCapture = useCapture;
	        this.priority = priority;
	        this.isRemoved = false;
	    }
	    EventListenerData.prototype.dispose = function () {
	        if (this.dispatcher) {
	            this.dispatcher.removeEventListener(this.type, this.listener, this.useCapture);
	            this.dispatcher = null;
	        }
	        _super.prototype.dispose.call(this);
	    };
	    return EventListenerData;
	}(seng_disposable_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EventListenerData;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var EventPhase;
	(function (EventPhase) {
	    EventPhase[EventPhase["NONE"] = 0] = "NONE";
	    EventPhase[EventPhase["CAPTURING_PHASE"] = 1] = "CAPTURING_PHASE";
	    EventPhase[EventPhase["AT_TARGET"] = 2] = "AT_TARGET";
	    EventPhase[EventPhase["BUBBLING_PHASE"] = 3] = "BUBBLING_PHASE";
	})(EventPhase || (EventPhase = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EventPhase;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	var CallListenerResult;
	(function (CallListenerResult) {
	    CallListenerResult[CallListenerResult["NONE"] = 0] = "NONE";
	    CallListenerResult[CallListenerResult["PROPAGATION_STOPPED"] = 1] = "PROPAGATION_STOPPED";
	    CallListenerResult[CallListenerResult["IMMEDIATE_PROPAGATION_STOPPED"] = 2] = "IMMEDIATE_PROPAGATION_STOPPED";
	})(CallListenerResult || (CallListenerResult = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CallListenerResult;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var _callListenerResult = 0 /* NONE */;
	var AbstractEvent = (function () {
	    function AbstractEvent(type, bubbles, cancelable, setTimeStamp) {
	        if (bubbles === void 0) { bubbles = false; }
	        if (cancelable === void 0) { cancelable = false; }
	        if (setTimeStamp === void 0) { setTimeStamp = false; }
	        this.type = type;
	        this.bubbles = bubbles;
	        this.cancelable = cancelable;
	        this.currentTarget = null;
	        this.target = null;
	        this.eventPhase = 0 /* NONE */;
	        this._defaultPrevented = false;
	        this.timeStamp = setTimeStamp ? Date.now() : 0;
	    }
	    Object.defineProperty(AbstractEvent.prototype, "defaultPrevented", {
	        get: function () {
	            return this._defaultPrevented;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    AbstractEvent.prototype.stopPropagation = function () {
	        if (_callListenerResult < 1 /* PROPAGATION_STOPPED */) {
	            _callListenerResult = 1 /* PROPAGATION_STOPPED */;
	        }
	    };
	    AbstractEvent.prototype.stopImmediatePropagation = function () {
	        _callListenerResult = 2 /* IMMEDIATE_PROPAGATION_STOPPED */;
	    };
	    AbstractEvent.prototype.preventDefault = function () {
	        if (this.cancelable) {
	            this._defaultPrevented = true;
	        }
	        else {
	        }
	    };
	    AbstractEvent.prototype.callListener = function (listener) {
	        _callListenerResult = 0 /* NONE */;
	        listener.call(null, this);
	        return _callListenerResult;
	    };
	    return AbstractEvent;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = AbstractEvent;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var EventTypeUtil_1 = __webpack_require__(10);
	var AbstractEvent_1 = __webpack_require__(8);
	var CommonEvent = (function (_super) {
	    __extends(CommonEvent, _super);
	    function CommonEvent() {
	        _super.apply(this, arguments);
	    }
	    CommonEvent.prototype.clone = function () {
	        return new CommonEvent(this.type, this.bubbles, this.cancelable);
	    };
	    CommonEvent.COMPLETE = EventTypeUtil_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.UPDATE = EventTypeUtil_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.INIT = EventTypeUtil_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.CHANGE = EventTypeUtil_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.OPEN = EventTypeUtil_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.CLOSE = EventTypeUtil_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.RESIZE = EventTypeUtil_1.EVENT_TYPE_PLACEHOLDER;
	    return CommonEvent;
	}(AbstractEvent_1.default));
	EventTypeUtil_1.generateEventTypes({ CommonEvent: CommonEvent });
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CommonEvent;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	exports.EVENT_TYPE_PLACEHOLDER = '__EventTypeUtil::EVENT_TYPE_PLACEHOLDER';
	exports.generateEventTypes = function (targets) {
	    Object.keys(targets).forEach(function (name) {
	        var target = targets[name];
	        Object.keys(target).forEach(function (prop) {
	            if (target[prop] === exports.EVENT_TYPE_PLACEHOLDER) {
	                target[prop] = name + "/" + prop;
	            }
	        });
	    });
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var AbstractEvent_1 = __webpack_require__(8);
	var BasicEvent = (function (_super) {
	    __extends(BasicEvent, _super);
	    function BasicEvent() {
	        _super.apply(this, arguments);
	    }
	    BasicEvent.prototype.clone = function () {
	        return new BasicEvent(this.type, this.bubbles, this.cancelable);
	    };
	    return BasicEvent;
	}(AbstractEvent_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BasicEvent;


/***/ }
/******/ ])
});
;
define(function() { return /******/ (function(modules) { // webpackBootstrap
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
	/**
	 * Base class that adds the ability to dispatch events and attach handlers that should be
	 * called when such events are triggered.
	 *
	 * This EventDispatcher also supports event capturing and bubbling phases, heavily inspired
	 * by existing event dispatching systems like the functionality described in the
	 * [DOM Event W3 spec](https://www.w3.org/TR/DOM-Level-2-Events/events.html)
	 */
	var EventDispatcher = (function (_super) {
	    __extends(EventDispatcher, _super);
	    /**
	     * Creates an EventDispatcher instance.
	     * @param parent If set, registers the given EventDispatcher instance as parent. This
	     * child-parent relationship is used in the event chain during the capture phase of
	     * events and the bubbling phase of bubbling events. For more information on event
	     * bubbling and capturing, see [[dispatchEvent]]
	     * @param target If set, will set the [[IEvent.target|target]] attribute of all events
	     * dispatched by this EventDispatcher to the given object. If not set, will use this instance
	     * as a target for dispatched events.
	     */
	    function EventDispatcher(parent, target) {
	        if (parent === void 0) { parent = null; }
	        _super.call(this);
	        /**
	         * An object containing all event listeners by [[IEvent.type|event type]]. Each value
	         * on this object is an Array of [[EventListenerData]] objects for each event listener
	         * added with that type.
	         */
	        this._listeners = {};
	        this._target = target || this;
	        this.parent = parent;
	    }
	    /**
	     * Dispatches the given event. The dispatch consists of three phases:
	     * 1. The capture phase. We walk through all ancestors of this EventDispatcher, with the
	     * top-most instance first and the direct parent of this EventDispatcher last. On each
	     * ancestor, we call all event handlers that are added with the _useCapture_ argument
	     * set to _true_ and the _eventType_ set to the same [[IEvent.type|type]] as
	     * the given event.
	     * If this EventDispatcher has no parent, this phase will be skipped.
	     * 2. The target phase. In this phase we call all event handlers on this EventDispatcher
	     * instance that listen for the same [[IEvent.type|type]] as the given event.
	     * 3. The bubbling phase. This phase will only be executed if the given event has the
	     * [[IEvent.bubbles|bubbles]] property set to _true_. If so, we will again walk through
	     * all ancestors of this EventDispatcher, but in the reverse order: the direct parent
	     * of this instance first and the top-most parent last. On every ancestor, we will call
	     * all event handlers that are added with the _useCapture_ argument set to _false_ and the
	     * _eventType_ set to the same [[IEvent.type|type]] as the given event.
	     *
	     * If any of the event handlers call [[IEvent.stopPropagation|stopPropagation()]], we will
	     * skip all event handlers that occur on a target later in the event chain. If an event handler
	     * calls [[IEvent.stopImmediatePropagation|stopImmediatePropagation()]], we will also skip
	     * any event handlers on the same target in the event chain.
	     * @param event The event to dispatch
	     * @returns If one of the handlers that have been called during this dispatch
	     * called [[IEvent.preventDefault|event.preventDefault()]], this method will return _false_.
	     * If no handlers have been called or none of the handlers have called
	     * [[IEvent.preventDefault|event.preventDefault()]], this method will return _true_.
	     *
	     * _Please note: [[IEvent.preventDefault|preventDefault()]] can only be called on
	     * events that have their [[IEvent.cancelable|cancelable]] property set to true_
	     */
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
	            return !event.defaultPrevented;
	        }
	        return true;
	    };
	    /**
	     * Adds a new event listener. The given handler function will be called in the following cases:
	     *  - An event with a [[IEvent.type|type]] that is equal to the given _eventType_ is dispatched
	     *  on this EventDispatcher instance.
	     *  - An event with a [[IEvent.type|type]] that is equal to the given _eventType_ is dispatched
	     *  on a child EventDispatcher, and the _useCapture_ parameter is set to _true_
	     *  - An event with [[IEvent.bubbles|bubbles]] set to _true_ and a [[IEvent.type|type]] that
	     *  is equal to the given _eventType_ is dispatched on a child EventDispatcher, and the
	     *  _useCapture_ parameter is set to _false_
	     *
	     * @see [[dispatchEvent]] for more info on the which event listeners are called during
	     * capturing and bubbling
	     * @param eventType The eventType to listen for
	     * @param handler The handler function that will be called when a matching event is dispatched.
	     * This function will retrieve the dispatched [[IEvent|event]] as a parameter
	     * @param useCapture Indicates if this handler should be called during the capturing phase
	     * of an event chain. If and only if this is set to _false_ will this handler be called
	     * during the bubbling phase of an event chain.
	     * @param priority A number that indicates the priority of this event listener relative
	     * to other event listeners of the same type on this EventDispatcher instance. A higher number
	     * indicates that this listener will be called earlier.
	     * @returns An object describing the listener that has a [[EventListenerData.dispose|dispose()]]
	     * method to remove the listener.
	     */
	    EventDispatcher.prototype.addEventListener = function (eventType, handler, useCapture, priority) {
	        if (useCapture === void 0) { useCapture = false; }
	        if (priority === void 0) { priority = 0; }
	        if (typeof (this._listeners[eventType]) === 'undefined') {
	            this._listeners[eventType] = [];
	        }
	        // todo: log in debug mode
	        var isDebugMode = false;
	        if (isDebugMode && this.hasEventListener(eventType, handler, useCapture)) {
	        }
	        // end todo
	        var data = new EventListenerData_1.default(this, eventType, handler, useCapture, priority);
	        this._listeners[eventType].push(data);
	        this._listeners[eventType].sort(this._listenerSorter);
	        return data;
	    };
	    /**
	     * Checks if an event listener matching the given parameters exists on this EventDispatcher
	     * instance.
	     * @param eventType Will only look for event listeners with this _eventType_
	     * @param handler If set, will only match event listeners that have the same handler function
	     * @param useCapture If set, will only match event listeners that have the same _useCapture_
	     * argument. _Please note: if no useCapture argument was provided to [[addEventListener]], it
	     * is set to false by default_
	     * @returns {boolean} True if one or more event listeners exist
	     */
	    EventDispatcher.prototype.hasEventListener = function (eventType, handler, useCapture) {
	        if (typeof handler === 'undefined') {
	            return !!this._listeners[eventType] && this._listeners[eventType].length > 0;
	        }
	        else if (!this._listeners[eventType]) {
	            return false;
	        }
	        else {
	            for (var i = 0; i < this._listeners[eventType].length; i++) {
	                var listenerData = this._listeners[eventType][i];
	                if (listenerData.handler === handler && (typeof useCapture === 'undefined' || useCapture === listenerData.useCapture)) {
	                    return true;
	                }
	            }
	            return false;
	        }
	    };
	    /**
	     * Checks if an event listener with a [[EventListenerData.type|type]] of the given _eventType_ exists
	     * on this EventDispatcher or any ancestor EventDispatcher instance.
	     * @param eventType The event type to check for
	     * @returns _true_ if a matching listener is found
	     */
	    EventDispatcher.prototype.willTrigger = function (eventType) {
	        return this.hasEventListener(eventType) || (!!this.parent && this.parent.willTrigger(eventType));
	    };
	    /**
	     * Removes all event listeners that match the given parameters from this EventDispatcher
	     * instance.
	     *
	     * _Please note: if you remove an event listener during the dispatch of an event it will
	     * not be called anymore, even if it was supposed to be called in the same event chain_
	     * @param eventType Only event listeners of that have this _eventType_ are removed
	     * @param handler Only event listeners that have this handler function will be removed
	     * @param useCapture Only event listeners that have been added with the same _useCapture_
	     * parameter will be removed. _Please note: if no useCapture argument is provided, only
	     * event listeners that have useCapture set to false will be removed._
	     */
	    EventDispatcher.prototype.removeEventListener = function (eventType, handler, useCapture) {
	        if (useCapture === void 0) { useCapture = false; }
	        exports.removeListenersFrom(this._listeners, eventType, handler, useCapture);
	    };
	    /**
	     * Removes all event listeners that have a [[IEvent.type|type]] of the given _eventType_
	     * from this EventDispatcher instance, regardless of their [[EventListenerData.handler|handler]] or
	     * [[EventListenerData.useCapture|useCapture]] property.
	     *
	     * _Please note: if you remove an event listener during the dispatch of an event it will
	     * not be called anymore, even if it was supposed to be called in the same event chain_
	     * @param eventType The [[IEvent.type|type]] of event to remove. If not provided, all event listeners
	     * will be removed regardless of their type.
	     */
	    EventDispatcher.prototype.removeAllEventListeners = function (eventType) {
	        exports.removeListenersFrom(this._listeners, eventType);
	    };
	    /**
	     * Cleans up this EventListener instance. No event handlers on this EventDispatcher will be called
	     * and future calls to dispatchEvent() will be ignored.
	     */
	    EventDispatcher.prototype.dispose = function () {
	        this.removeAllEventListeners();
	        _super.prototype.dispose.call(this);
	    };
	    /**
	     * Method that is used to sort arrays of event listeners based on their [[EventListenerData.priority|priority]]
	     * property. Higher priority will be sorted before lower priority values.
	     * @param e1 The first event listener to compare
	     * @param e2 The other event listener to compare to
	     * @returns A number that indicates the sorting according to the JS sort() method.
	     */
	    EventDispatcher.prototype._listenerSorter = function (e1, e2) {
	        return e2.priority - e1.priority;
	    };
	    return EventDispatcher;
	}(seng_disposable_1.default));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EventDispatcher;
	/**
	 * Helper function for [[EventDispatcher.removeEventListener]] and [[EventDispatcher.removeAllEventListeners]].
	 * Will remove all event listeners that match the given parameters from the given event listener map object.
	 * This function differs from [[EventDispatcher.removeEventListener|removeEventListener()]] in that it does not
	 * use default values when you emit one of the parameters. Instead, it will remove event listeners of all
	 * possible values for that parameter.
	 * @param listeners A map of listeners to remove from. See [[EventDispatcher._listeners]]
	 * @param eventType If set, will only remove listeners added with this _eventType_
	 * @param handler If set, will only remove listeners with this _handler_
	 * @param useCapture If set, will only remove listeners with the same value for _useCapture_
	 */
	exports.removeListenersFrom = function (listeners, eventType, handler, useCapture) {
	    for (var i in listeners) {
	        if (listeners.hasOwnProperty(i)) {
	            var matchesEventType = !eventType || i === eventType;
	            if (matchesEventType && listeners.hasOwnProperty(i) && listeners[i] instanceof Array) {
	                var listenersForType = listeners[i];
	                // traverse the array in reverse. this will make sure removal does not affect the loop
	                for (var j = listenersForType.length; j; j--) {
	                    var listenerData = listenersForType[j - 1];
	                    if ((!handler || handler === listenerData.handler) && (typeof useCapture === 'undefined' || !!useCapture == listenerData.useCapture)) {
	                        listenersForType.splice(j - 1, 1);
	                        // mark the listener as removed, because it might still be active in the current event loop
	                        listenerData.isRemoved = true;
	                    }
	                }
	                // If an eventType was provided, this will be the only property where we need to remove listeners
	                if (eventType) {
	                    break;
	                }
	            }
	        }
	    }
	};
	/**
	 * Gets an array of all parent EventDispatcher instances of the given EventDispatcher. The direct
	 * parent (if it has one) will be first in the Array, and the most top-level parent will be last.
	 * @param target The instance to get parents for
	 * @returns {Array<EventDispatcher>} The array of parents
	 */
	exports.getParents = function (target) {
	    var currentTarget = target;
	    var parents = [];
	    while (currentTarget.parent) {
	        currentTarget = currentTarget.parent;
	        parents.push(currentTarget);
	    }
	    return parents;
	};
	/**
	 * Gets an array that represents the entire call tree when an event is dispatched on the given target.
	 * See [[EventDispatcher.dispatchEvent]] for more information on the event phases
	 * @param target The target to get the call tree for
	 * @param bubbles If true, will also include the target instances of the _bubbling_ phase. If false, will
	 * only include the _capture_ and _target_ phases.
	 * @returns An array of EventDispatcher instances in the order that an event will travel during dispatch
	 * on the given target.
	 */
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
	/**
	 * Calls all listeners on the given event listener map that should be called when the given event is
	 * dispatched. If no matching listeners are present, this function has no effect
	 * @param listeners The object that contains listeners to call. Has the same format as the
	 * [[EventDispatcher._listeners|_listeners]] property on [[EventDispatcher]]
	 * @param event The event that may trigger listeners in the map
	 * @returns True if any of the listeners call [[IEvent.stopPropagation|stopPropagation()]] or
	 * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]]. False if no listeners are called or none
	 * of them call [[IEvent.stopPropagation|stopPropagation()]] or
	 * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]]
	 */
	exports.callListeners = function (listeners, event) {
	    var listenersOfType = listeners[event.type] ? listeners[event.type].slice() : [];
	    var propagationIsStopped = false;
	    for (var i = 0; i < listenersOfType.length; i++) {
	        var disabledOnPhase = listenersOfType[i].useCapture ? 3 /* BUBBLING_PHASE */ : 1 /* CAPTURING_PHASE */;
	        if (event.eventPhase !== disabledOnPhase && !listenersOfType[i].isRemoved) {
	            var callResult = event.callListener(listenersOfType[i].handler);
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
	/**
	 * Data object that is created on every call to [[EventDispatcher.addEventListener]]. The object is
	 * saved on the [[EventDispatcher._listeners]] object for internal use but is also returned by the
	 * _addEventListener_ method as a way to remove the listener.
	 */
	var EventListenerData = (function (_super) {
	    __extends(EventListenerData, _super);
	    /**
	     * @param dispatcher The EventDispatcher on which this listener listens for events
	     * @param type The type of event this listener responds to
	     * @param handler The handler function that will be called when a matching event is dispatched
	     * @param useCapture Set to the _useCapture_ argument passed to [[EventDispatcher.addEventListener|addEventListener]]
	     * @param priority Set to the _priority_ argument passed to [[EventDispatcher.addEventListener|addEventListener]].
	     * Used to sort the listener within the [[EventDispatcher._listeners|_listeners]] object of the EventDispatcher
	     */
	    function EventListenerData(dispatcher, type, handler, useCapture, priority) {
	        _super.call(this);
	        this.dispatcher = dispatcher;
	        this.type = type;
	        this.handler = handler;
	        this.useCapture = useCapture;
	        this.priority = priority;
	        /**
	         * This property will be set to _true_ by the [[EventDispatcher]] this listener is bound to when
	         * the listener is removed. This is to make sure the handler is not called, even if the listener
	         * is removed while dispatching the event.
	         */
	        this.isRemoved = false;
	    }
	    /**
	     * Detaches this event listener from its EventDispatcher. The handler function on this listener will
	     * no longer be called in response to dispatched events.
	     */
	    EventListenerData.prototype.dispose = function () {
	        if (this.dispatcher) {
	            this.dispatcher.removeEventListener(this.type, this.handler, this.useCapture);
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
	/**
	 * An enum for possible event phases that an event can be in
	 */
	var EventPhase;
	(function (EventPhase) {
	    /**
	     * Indicates that the event is currently not being dispatched
	     */
	    EventPhase[EventPhase["NONE"] = 0] = "NONE";
	    /**
	     * Indicates that the event is in the capturing phase, moving down from the top-most EventDispatcher
	     * instance to the parent of the target EventDispatcher
	     */
	    EventPhase[EventPhase["CAPTURING_PHASE"] = 1] = "CAPTURING_PHASE";
	    /**
	     * Indicates that we are currently calling the event listeners on the event target during dispatch.
	     */
	    EventPhase[EventPhase["AT_TARGET"] = 2] = "AT_TARGET";
	    /**
	     * Indicates that we are currently moving back up from the parent of the target EventDispatcher to
	     * the top-most EventDispatcher instance.
	     */
	    EventPhase[EventPhase["BUBBLING_PHASE"] = 3] = "BUBBLING_PHASE";
	})(EventPhase || (EventPhase = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = EventPhase;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Enum that is returned by the [[AbstractEvent.callListener]] method
	 */
	var CallListenerResult;
	(function (CallListenerResult) {
	    /**
	     * Indicates that neither [[IEvent.stopPropagation|stopPropagation]] nor
	     * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] has been called
	     */
	    CallListenerResult[CallListenerResult["NONE"] = 0] = "NONE";
	    /**
	     * Indicates that [[IEvent.stopPropagation|stopPropagation]] has been called, but
	     * [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] hasn't
	     */
	    CallListenerResult[CallListenerResult["PROPAGATION_STOPPED"] = 1] = "PROPAGATION_STOPPED";
	    /**
	     * Indicates that [[IEvent.stopImmediatePropagation|stopImmediatePropagation]] has been called
	     */
	    CallListenerResult[CallListenerResult["IMMEDIATE_PROPAGATION_STOPPED"] = 2] = "IMMEDIATE_PROPAGATION_STOPPED";
	})(CallListenerResult || (CallListenerResult = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CallListenerResult;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var _callListenerResult = 0 /* NONE */;
	/**
	 * Abstract base class for all events that can be dispatched through [[EventDispatcher]]. This class
	 * should not be instantiated but extended by a specific event class. For an event class with basic
	 * functionality that can be instantiated see [[BasicEvent]]
	 */
	var AbstractEvent = (function () {
	    /**
	     * Creates a new AbstractEvent instance.
	     * @param type The type of the event. Event listeners will only be called if their eventType match this type.
	     * @param bubbles If true, the event will also go through a bubbling phase. See [[EventDispatcher.dispatchEvent]]
	     * for more information on the event phases.
	     * @param cancelable Indicates if [[preventDefault]] can be called on this event. This will prevent the 'default
	     * action' of the event from being executed. It is up to the [[EventDispatcher]] instance that dispatches the
	     * event to stop the default action from executing when the [[EventDispatcher.dispatchEvent|dispatchEvent]]
	     * method returns _false_
	     * @param setTimeStamp If true, will set the [[timeStamp]] property of this event to the current time whenever
	     * this event is dispatched.
	     */
	    function AbstractEvent(type, bubbles, cancelable, setTimeStamp) {
	        if (bubbles === void 0) { bubbles = false; }
	        if (cancelable === void 0) { cancelable = false; }
	        if (setTimeStamp === void 0) { setTimeStamp = false; }
	        this.type = type;
	        this.bubbles = bubbles;
	        this.cancelable = cancelable;
	        /**
	         * Will be updated by [[EventDispatcher]] during the dispatch of an event to the target that
	         * listeners are currently being called on. After completion of an event dispatch this value
	         * will be reset to _null_.
	         */
	        this.currentTarget = null;
	        /**
	         * Will be updated by [[EventDispatcher]] when [[EventDispatcher.dispatchEvent|dispatchEvent]] is
	         * called with this event. The value will be set to the EventDispatcher instance that dispatched
	         * the event.
	         */
	        this.target = null;
	        /**
	         * The current event phase of this event. During event dispatch, this value will be either [[EventPhase.CAPTURING_PHASE|CAPTURING_PHASE]],
	         * [[EventPhase.AT_TARGET|AT_TARGET]] or [[EventPhase.BUBBLING_PHASE|BUBBLING_PHASE]]. If this event is not currently
	         * being dispatched this will be set to [[EventPhase.NONE|NONE]].
	         */
	        this.eventPhase = 0 /* NONE */;
	        /**
	         *  _true_ if [[cancelable]] is true and [[preventDefault]] has been called on this event.
	         */
	        this._defaultPrevented = false;
	        this.timeStamp = setTimeStamp ? Date.now() : 0;
	    }
	    Object.defineProperty(AbstractEvent.prototype, "defaultPrevented", {
	        /**
	         * _true_ if [[cancelable]] is true and [[preventDefault]] has been called on this event.
	         */
	        get: function () {
	            return this._defaultPrevented;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * When called during the dispatch of an event, will prevent any targets further in the event chain
	     * from being processed. All listeners on the current target will still be executed.
	     * @see [[EventDispatcher.dispatchEvent]]
	     */
	    AbstractEvent.prototype.stopPropagation = function () {
	        if (_callListenerResult < 1 /* PROPAGATION_STOPPED */) {
	            _callListenerResult = 1 /* PROPAGATION_STOPPED */;
	        }
	    };
	    /**
	     * When called during the dispatch of an event, will prevent any other event listener from being
	     * called for this event.
	     * @see [[EventDispatcher.dispatchEvent]]
	     */
	    AbstractEvent.prototype.stopImmediatePropagation = function () {
	        _callListenerResult = 2 /* IMMEDIATE_PROPAGATION_STOPPED */;
	    };
	    /**
	     * May only be called when the [[cancelable]] property of an event is set to _true_. Indicates to the
	     * instance that dispatched the event that the default action for the event should not be executed.
	     */
	    AbstractEvent.prototype.preventDefault = function () {
	        if (this.cancelable) {
	            this._defaultPrevented = true;
	        }
	        else {
	            throw new Error('Called preventDefault on a non-cancelable event');
	        }
	    };
	    /**
	     * Calls the given event handler, and returns an enum value that indicates if [[stopPropagation]] or
	     * [[stopImmediatePropagation]] have been called on this event during the execution of that handler.
	     * @param handler The event handler to execute
	     * @returns An enum value, see [[CallListenerResult]]
	     */
	    AbstractEvent.prototype.callListener = function (handler) {
	        _callListenerResult = 0 /* NONE */;
	        handler.call(null, this);
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
	var eventTypeUtils_1 = __webpack_require__(10);
	var AbstractEvent_1 = __webpack_require__(8);
	var CommonEvent = (function (_super) {
	    __extends(CommonEvent, _super);
	    function CommonEvent() {
	        _super.apply(this, arguments);
	    }
	    CommonEvent.prototype.clone = function () {
	        return new CommonEvent(this.type, this.bubbles, this.cancelable);
	    };
	    CommonEvent.COMPLETE = eventTypeUtils_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.UPDATE = eventTypeUtils_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.INIT = eventTypeUtils_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.CHANGE = eventTypeUtils_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.OPEN = eventTypeUtils_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.CLOSE = eventTypeUtils_1.EVENT_TYPE_PLACEHOLDER;
	    CommonEvent.RESIZE = eventTypeUtils_1.EVENT_TYPE_PLACEHOLDER;
	    return CommonEvent;
	}(AbstractEvent_1.default));
	eventTypeUtils_1.generateEventTypes({ CommonEvent: CommonEvent });
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = CommonEvent;


/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Constant string that can be used as a placeholder for the static event types on an
	 * [[IEvent]] class. See [[generateEventTypes]] for usage.
	 */
	exports.EVENT_TYPE_PLACEHOLDER = '__eventTypeUtil::EVENT_TYPE_PLACEHOLDER';
	/**
	 * It is common practice to have static properties on an [[AbstractEvent|event class]] that indicate
	 * which event types should be used with that class. For example:
	 * ```typescript
	 * // FooEvent.ts
	 * class FooEvent extends AbstractEvent {
	 *    ...
	 *    public static COMPLETE:string = 'complete';
	 *    ...
	 * }
	 * // BarEvent.ts
	 * class BarEvent extends AbstractEvent {
	 *    ...
	 *    public static COMPLETE:string = 'complete';
	 *    ...
	 * }
	 * ```
	 * One problem with this example is that all event handlers added using [[EventDispatcher.addEventListener]] for
	 * _FooEvent.COMPLETE_ will also be called when the unrelated _BarEvent.COMPLETE_ is dispatched.
	 * To prevent this it is best practice to prefix the event type with the event class, like so:
	 * ```typescript
	 * // FooEvent.ts
	 * class FooEvent extends AbstractEvent {
	 *    ...
	 *    public static COMPLETE:string = 'FooEvent/COMPLETE';
	 *    ...
	 * }
	 * // BarEvent.ts
	 * class BarEvent extends AbstractEvent {
	 *    ...
	 *    public static COMPLETE:string = 'BarEvent/COMPLETE';
	 *    ...
	 * }
	 * ```
	 * This utility provides a way to generate these event types, making sure that the event types stay consistent
	 * throughout your application and that no string is mistyped by accident. Using this utility, our example now
	 * looks like this:
	 * ```typescript
	 * // FooEvent.ts
	 * import {generateEventTypes, EVENT_TYPE_PLACEHOLDER} from 'seng-event/lib/util/eventTypeUtils';
	 * class FooEvent extends AbstractEvent {
	 *    ...
	 *    public static COMPLETE:string = EVENT_TYPE_PLACEHOLDER;
	 *    ...
	 * }
	 * generateEventTypes({FooEvent});
	 * // BarEvent.ts
	 * import {generateEventTypes, EVENT_TYPE_PLACEHOLDER} from 'seng-event/lib/util/eventTypeUtils';
	 * class BarEvent extends AbstractEvent {
	 *    ...
	 *    public static COMPLETE:string = EVENT_TYPE_PLACEHOLDER;
	 *    ...
	 * }
	 * generateEventTypes({BarEvent});
	 * ```
	 *
	 * What this util technically does is it loops through the given object's properties and replaces values
	 * with _ClassName/propertyName_ every time it encounters a value equal to [[EVENT_TYPE_PLACEHOLDER]].
	 *
	 * The event class [[CommonEvent]] that is included with seng-event also uses this utility to generate
	 * event names.
	 *
	 * @param targets An object containing the classes on which types should be generated. Because we cannot
	 * reliably detect the name of any given Class, you have to pass an object with the names of the Classes as keys
	 * and the classes themselves as values: `{ 'Class1' : Class1, 'Class2' : Class2 }`. Using the new ES6 property
	 * names shorthand, we can simplify that to the following: `{ Class1, Class2 }`.
	 */
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
/******/ ])});;
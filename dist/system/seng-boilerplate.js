var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("lib/EventPhase", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var EventPhase;
    return {
        setters:[],
        execute: function() {
            (function (EventPhase) {
                EventPhase[EventPhase["NONE"] = 0] = "NONE";
                EventPhase[EventPhase["CAPTURING_PHASE"] = 1] = "CAPTURING_PHASE";
                EventPhase[EventPhase["AT_TARGET"] = 2] = "AT_TARGET";
                EventPhase[EventPhase["BUBBLING_PHASE"] = 3] = "BUBBLING_PHASE";
            })(EventPhase || (EventPhase = {}));
            exports_1("default",EventPhase);
        }
    }
});
System.register("lib/CallListenerResult", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var CallListenerResult;
    return {
        setters:[],
        execute: function() {
            (function (CallListenerResult) {
                CallListenerResult[CallListenerResult["NONE"] = 0] = "NONE";
                CallListenerResult[CallListenerResult["PROPAGATION_STOPPED"] = 1] = "PROPAGATION_STOPPED";
                CallListenerResult[CallListenerResult["IMMEDIATE_PROPAGATION_STOPPED"] = 2] = "IMMEDIATE_PROPAGATION_STOPPED";
            })(CallListenerResult || (CallListenerResult = {}));
            exports_2("default",CallListenerResult);
        }
    }
});
System.register("lib/IEvent", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("lib/EventListenerData", ["seng-disposable"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var seng_disposable_1;
    var EventListenerData;
    return {
        setters:[
            function (seng_disposable_1_1) {
                seng_disposable_1 = seng_disposable_1_1;
            }],
        execute: function() {
            EventListenerData = (function (_super) {
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
            exports_4("default", EventListenerData);
        }
    }
});
System.register("lib/IEventDispatcher", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("lib/EventDispatcher", ['seng-disposable', "lib/EventListenerData"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var seng_disposable_2, EventListenerData_1;
    var EventDispatcher, removeListenersFrom, getCallTree, getParents, callListeners;
    return {
        setters:[
            function (seng_disposable_2_1) {
                seng_disposable_2 = seng_disposable_2_1;
            },
            function (EventListenerData_1_1) {
                EventListenerData_1 = EventListenerData_1_1;
            }],
        execute: function() {
            EventDispatcher = (function (_super) {
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
                        var callTree = getCallTree(this, event.bubbles);
                        event.target = this._target;
                        event.eventPhase = callTree.length === 1 ? 2 /* AT_TARGET */ : 1 /* CAPTURING_PHASE */;
                        for (var i = 0; i < callTree.length; i++) {
                            var currentTarget = callTree[i];
                            event.currentTarget = currentTarget;
                            if (currentTarget === this) {
                                event.eventPhase = 2 /* AT_TARGET */;
                            }
                            var propagationIsStopped = callListeners(currentTarget._listeners, event);
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
                    removeListenersFrom(this._listeners, false, eventType, listener, useCapture);
                };
                EventDispatcher.prototype.removeAllEventListeners = function (eventType) {
                    removeListenersFrom(this._listeners, true, eventType);
                };
                EventDispatcher.prototype.dispose = function () {
                    this.removeAllEventListeners();
                    _super.prototype.dispose.call(this);
                };
                EventDispatcher.prototype._listenerSorter = function (e1, e2) {
                    return e2.priority - e1.priority;
                };
                return EventDispatcher;
            }(seng_disposable_2.default));
            exports_6("default", EventDispatcher);
            exports_6("removeListenersFrom", removeListenersFrom = function (listeners, removeAll, eventType, listener, useCapture) {
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
            });
            exports_6("getCallTree", getCallTree = function (target, bubbles) {
                var callTree = [];
                var parents = getParents(target);
                for (var i = parents.length; i; i--) {
                    callTree.push(parents[i - 1]);
                }
                callTree.push(target);
                if (bubbles) {
                    Array.prototype.push.apply(callTree, parents);
                }
                return callTree;
            });
            exports_6("getParents", getParents = function (target) {
                var currentTarget = target;
                var parents = [];
                while (currentTarget.parent) {
                    currentTarget = currentTarget.parent;
                    parents.push(currentTarget);
                }
                return parents;
            });
            exports_6("callListeners", callListeners = function (listeners, event) {
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
            });
        }
    }
});
System.register("lib/AbstractEvent", [], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var _callListenerResult, AbstractEvent;
    return {
        setters:[],
        execute: function() {
            _callListenerResult = 0 /* NONE */;
            AbstractEvent = (function () {
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
            exports_7("default",AbstractEvent);
        }
    }
});
System.register("lib/util/EventTypeUtil", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var EVENT_TYPE_PLACEHOLDER, generateEventTypes;
    return {
        setters:[],
        execute: function() {
            exports_8("EVENT_TYPE_PLACEHOLDER", EVENT_TYPE_PLACEHOLDER = '__EventTypeUtil::EVENT_TYPE_PLACEHOLDER');
            exports_8("generateEventTypes", generateEventTypes = function (targets) {
                Object.keys(targets).forEach(function (name) {
                    var target = targets[name];
                    Object.keys(target).forEach(function (prop) {
                        if (target[prop] === EVENT_TYPE_PLACEHOLDER) {
                            target[prop] = name + "/" + prop;
                        }
                    });
                });
            });
        }
    }
});
System.register("lib/event/CommonEvent", ["lib/util/EventTypeUtil", "lib/AbstractEvent"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var EventTypeUtil_1, AbstractEvent_1;
    var CommonEvent;
    return {
        setters:[
            function (EventTypeUtil_1_1) {
                EventTypeUtil_1 = EventTypeUtil_1_1;
            },
            function (AbstractEvent_1_1) {
                AbstractEvent_1 = AbstractEvent_1_1;
            }],
        execute: function() {
            CommonEvent = (function (_super) {
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
            exports_9("default",CommonEvent);
        }
    }
});
System.register("lib/event/BasicEvent", ["lib/AbstractEvent"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var AbstractEvent_2;
    var BasicEvent;
    return {
        setters:[
            function (AbstractEvent_2_1) {
                AbstractEvent_2 = AbstractEvent_2_1;
            }],
        execute: function() {
            BasicEvent = (function (_super) {
                __extends(BasicEvent, _super);
                function BasicEvent() {
                    _super.apply(this, arguments);
                }
                BasicEvent.prototype.clone = function () {
                    return new BasicEvent(this.type, this.bubbles, this.cancelable);
                };
                return BasicEvent;
            }(AbstractEvent_2.default));
            exports_10("default",BasicEvent);
        }
    }
});
System.register("index", ["lib/EventDispatcher", "lib/EventPhase", "lib/EventListenerData", "lib/CallListenerResult", "lib/AbstractEvent", "lib/event/CommonEvent", "lib/event/BasicEvent", "lib/util/EventTypeUtil"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var EventDispatcher_1;
    return {
        setters:[
            function (EventDispatcher_1_1) {
                EventDispatcher_1 = EventDispatcher_1_1;
            },
            function (EventPhase_1_1) {
                exports_11({
                    "EventPhase": EventPhase_1_1["default"]
                });
            },
            function (EventListenerData_2_1) {
                exports_11({
                    "EventListenerData": EventListenerData_2_1["default"]
                });
            },
            function (CallListenerResult_1_1) {
                exports_11({
                    "CallListenerResult": CallListenerResult_1_1["default"]
                });
            },
            function (AbstractEvent_3_1) {
                exports_11({
                    "AbstractEvent": AbstractEvent_3_1["default"]
                });
            },
            function (_1) {},
            function (_2) {},
            function (_3) {}],
        execute: function() {
            exports_11("default",EventDispatcher_1.default);
        }
    }
});

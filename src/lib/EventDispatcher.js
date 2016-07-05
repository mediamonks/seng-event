"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var seng_disposable_1 = require('seng-disposable');
var EventListenerData_1 = require("./EventListenerData");
var EventDispatcher = (function (_super) {
    __extends(EventDispatcher, _super);
    function EventDispatcher(target, parent) {
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
    EventDispatcher.prototype.addEventListener = function (type, listener, useCapture, priority) {
        if (useCapture === void 0) { useCapture = false; }
        if (priority === void 0) { priority = 0; }
        if (typeof (this._listeners[type]) === 'undefined') {
            this._listeners[type] = [];
        }
        // todo: log in debug mode
        var isDebugMode = false;
        if (isDebugMode && this.hasEventListener(type, listener, useCapture)) {
        }
        // end todo
        var data = new EventListenerData_1.default(this, type, listener, useCapture, priority);
        this._listeners[type].push(data);
        this._listeners[type].sort(this._listenerSorter);
        return data;
    };
    EventDispatcher.prototype.hasEventListener = function (type, listener, useCapture) {
        if (typeof listener === 'undefined') {
            return this._listeners[type] && this._listeners[type].length > 0;
        }
        else if (!this._listeners[type]) {
            return false;
        }
        else {
            for (var i = 0; i < this._listeners[type].length; i++) {
                var listenerData = this._listeners[type][i];
                if (listenerData.listener === listener && (typeof useCapture === 'undefined' || useCapture === listenerData.useCapture)) {
                    return true;
                }
            }
            return false;
        }
    };
    EventDispatcher.prototype.willTrigger = function (type) {
        return this.hasEventListener(type) || (this.parent && this.parent.willTrigger(type));
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        if ((type in this._listeners) && (this._listeners[type] instanceof Array)) {
            for (var i = this._listeners[type].length; i; i--) {
                var listenerData = this._listeners[type][i - 1];
                if (listenerData.listener === listener && listenerData.useCapture === useCapture) {
                    this._listeners[type].splice(i - 1, 1);
                }
            }
        }
        else {
        }
    };
    EventDispatcher.prototype.removeAllEventListeners = function (type) {
        if (type === void 0) {
            this._listeners = {};
        }
        else if ((type in this._listeners) && (this._listeners[type] instanceof Array)) {
            this._listeners[type].length = 0;
        }
        else {
        }
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
    var listenersOfType = listeners[event.type] || [];
    var propagationIsStopped = false;
    for (var i = 0; i < listenersOfType.length; i++) {
        var disabledOnPhase = listenersOfType[i].useCapture ? 3 /* BUBBLING_PHASE */ : 1 /* CAPTURING_PHASE */;
        if (event.eventPhase !== disabledOnPhase) {
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

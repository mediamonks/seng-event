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

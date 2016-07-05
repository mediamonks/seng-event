let _callListenerResult = 0 /* NONE */;
class AbstractEvent {
    constructor(type, bubbles = false, cancelable = false, target = null, setTimeStamp = false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.target = target;
        this.currentTarget = null;
        this.eventPhase = 0 /* NONE */;
        this._defaultPrevented = false;
        this.callListener = (listener) => {
            _callListenerResult = 0 /* NONE */;
            listener.call(null, this);
            return _callListenerResult;
        };
        this.timeStamp = setTimeStamp ? Date.now() : 0;
    }
    get defaultPrevented() {
        return this._defaultPrevented;
    }
    stopPropagation() {
        if (_callListenerResult < 1 /* PROPAGATION_STOPPED */) {
            _callListenerResult = 1 /* PROPAGATION_STOPPED */;
        }
    }
    stopImmediatePropagation() {
        _callListenerResult = 2 /* IMMEDIATE_PROPAGATION_STOPPED */;
    }
    preventDefault() {
        if (this.cancelable) {
            this._defaultPrevented = true;
        }
        else {
        }
    }
}
export default AbstractEvent;

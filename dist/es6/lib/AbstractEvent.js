let _callListenerResult = 0 /* NONE */;
class AbstractEvent {
    constructor(type, bubbles = false, cancelable = false, setTimeStamp = false) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.currentTarget = null;
        this.target = null;
        this.eventPhase = 0 /* NONE */;
        this._defaultPrevented = false;
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
    callListener(listener) {
        _callListenerResult = 0 /* NONE */;
        listener.call(null, this);
        return _callListenerResult;
    }
}
export default AbstractEvent;

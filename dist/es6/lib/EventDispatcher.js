import Disposable from 'seng-disposable';
import EventListenerData from "./EventListenerData";
export default class EventDispatcher extends Disposable {
    constructor(target, parent = null) {
        super();
        this._listeners = {};
        this._target = target || this;
        this.parent = parent;
    }
    dispatchEvent(event) {
        if (this.isDisposed()) {
        }
        else {
            // todo: on debug builds, check willTrigger and log if false
            const callTree = getCallTree(this, event.bubbles);
            event.target = this._target;
            event.eventPhase = callTree.length === 1 ? 2 /* AT_TARGET */ : 1 /* CAPTURING_PHASE */;
            for (let i = 0; i < callTree.length; i++) {
                const currentTarget = callTree[i];
                event.currentTarget = currentTarget;
                if (currentTarget === this) {
                    event.eventPhase = 2 /* AT_TARGET */;
                }
                const propagationIsStopped = callListeners(currentTarget._listeners, event);
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
    }
    addEventListener(type, listener, useCapture = false, priority = 0) {
        if (typeof (this._listeners[type]) === 'undefined') {
            this._listeners[type] = [];
        }
        // todo: log in debug mode
        const isDebugMode = false;
        if (isDebugMode && this.hasEventListener(type, listener, useCapture)) {
        }
        // end todo
        const data = new EventListenerData(this, type, listener, useCapture, priority);
        this._listeners[type].push(data);
        this._listeners[type].sort(this._listenerSorter);
        return data;
    }
    hasEventListener(type, listener, useCapture) {
        if (typeof listener === 'undefined') {
            return this._listeners[type] && this._listeners[type].length > 0;
        }
        else if (!this._listeners[type]) {
            return false;
        }
        else {
            for (let i = 0; i < this._listeners[type].length; i++) {
                const listenerData = this._listeners[type][i];
                if (listenerData.listener === listener && (typeof useCapture === 'undefined' || useCapture === listenerData.useCapture)) {
                    return true;
                }
            }
            return false;
        }
    }
    willTrigger(type) {
        return this.hasEventListener(type) || (this.parent && this.parent.willTrigger(type));
    }
    removeEventListener(type, listener, useCapture = false) {
        if ((type in this._listeners) && (this._listeners[type] instanceof Array)) {
            for (let i = this._listeners[type].length; i; i--) {
                let listenerData = this._listeners[type][i - 1];
                if (listenerData.listener === listener && listenerData.useCapture === useCapture) {
                    this._listeners[type].splice(i - 1, 1);
                }
            }
        }
        else {
        }
    }
    removeAllEventListeners(type) {
        if (type === void 0) {
            this._listeners = {};
        }
        else if ((type in this._listeners) && (this._listeners[type] instanceof Array)) {
            this._listeners[type].length = 0;
        }
        else {
        }
    }
    _listenerSorter(e1, e2) {
        return e2.priority - e1.priority;
    }
    dispose() {
        this.removeAllEventListeners();
        super.dispose();
    }
}
export const getCallTree = (target, bubbles) => {
    const callTree = [];
    const parents = getParents(target);
    for (let i = parents.length; i; i--) {
        callTree.push(parents[i - 1]);
    }
    callTree.push(target);
    if (bubbles) {
        Array.prototype.push.apply(callTree, parents);
    }
    return callTree;
};
export const getParents = (target) => {
    let currentTarget = target;
    const parents = [];
    while (currentTarget.parent) {
        currentTarget = currentTarget.parent;
        parents.push(currentTarget);
    }
    return parents;
};
export const callListeners = (listeners, event) => {
    const listenersOfType = listeners[event.type] || [];
    let propagationIsStopped = false;
    for (let i = 0; i < listenersOfType.length; i++) {
        const disabledOnPhase = listenersOfType[i].useCapture ? 3 /* BUBBLING_PHASE */ : 1 /* CAPTURING_PHASE */;
        if (event.eventPhase !== disabledOnPhase) {
            const callResult = event.callListener(listenersOfType[i].listener);
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

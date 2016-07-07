import Disposable from 'seng-disposable';
import EventListenerData from "./EventListenerData";
export default class EventDispatcher extends Disposable {
    constructor(parent = null, target) {
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
    addEventListener(eventType, listener, useCapture = false, priority = 0) {
        if (typeof (this._listeners[eventType]) === 'undefined') {
            this._listeners[eventType] = [];
        }
        // todo: log in debug mode
        const isDebugMode = false;
        if (isDebugMode && this.hasEventListener(eventType, listener, useCapture)) {
        }
        // end todo
        const data = new EventListenerData(this, eventType, listener, useCapture, priority);
        this._listeners[eventType].push(data);
        this._listeners[eventType].sort(this._listenerSorter);
        return data;
    }
    hasEventListener(eventType, listener, useCapture) {
        if (typeof listener === 'undefined') {
            return this._listeners[eventType] && this._listeners[eventType].length > 0;
        }
        else if (!this._listeners[eventType]) {
            return false;
        }
        else {
            for (let i = 0; i < this._listeners[eventType].length; i++) {
                const listenerData = this._listeners[eventType][i];
                if (listenerData.listener === listener && (typeof useCapture === 'undefined' || useCapture === listenerData.useCapture)) {
                    return true;
                }
            }
            return false;
        }
    }
    willTrigger(eventType) {
        return this.hasEventListener(eventType) || (this.parent && this.parent.willTrigger(eventType));
    }
    removeEventListener(eventType, listener, useCapture = false) {
        removeListenersFrom(this._listeners, false, eventType, listener, useCapture);
    }
    removeAllEventListeners(eventType) {
        removeListenersFrom(this._listeners, true, eventType);
    }
    dispose() {
        this.removeAllEventListeners();
        super.dispose();
    }
    _listenerSorter(e1, e2) {
        return e2.priority - e1.priority;
    }
}
export const removeListenersFrom = (listeners, removeAll, eventType, listener, useCapture) => {
    // build an array with arrays of events for each eventType we want to remove from
    const removeFrom = [];
    if (eventType) {
        // eventType argument is set, just remove from this type
        if ((eventType in listeners) && (listeners[eventType] instanceof Array)) {
            removeFrom.push(listeners[eventType]);
        }
    }
    else {
        // eventType not set, add all event types with listeners
        for (let i in listeners) {
            if (listeners.hasOwnProperty(i) && listeners[i] instanceof Array) {
                removeFrom.push(listeners[i]);
            }
        }
    }
    if (removeFrom.length) {
        for (let i = 0; i < removeFrom.length; i++) {
            const listenersForType = removeFrom[i];
            for (let j = listenersForType.length; j; j--) {
                let listenerData = listenersForType[j - 1];
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
    const listenersOfType = listeners[event.type] ? [...listeners[event.type]] : [];
    let propagationIsStopped = false;
    for (let i = 0; i < listenersOfType.length; i++) {
        const disabledOnPhase = listenersOfType[i].useCapture ? 3 /* BUBBLING_PHASE */ : 1 /* CAPTURING_PHASE */;
        if (event.eventPhase !== disabledOnPhase && !listenersOfType[i].isRemoved) {
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

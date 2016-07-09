import Disposable from "seng-disposable";
/**
 * Data object that is created on every call to [[EventDispatcher.addEventListener]]. The object is
 * saved on the [[EventDispatcher._listeners]] object for internal use but is also returned by the
 * _addEventListener_ method as a way to remove the listener.
 */
export default class EventListenerData extends Disposable {
    /**
     * @param dispatcher The EventDispatcher on which this listener listens for events
     * @param type The type of event this listener responds to
     * @param handler The handler function that will be called when a matching event is dispatched
     * @param useCapture Set to the _useCapture_ argument passed to [[EventDispatcher.addEventListener|addEventListener]]
     * @param priority Set to the _priority_ argument passed to [[EventDispatcher.addEventListener|addEventListener]].
     * Used to sort the listener within the [[EventDispatcher._listeners|_listeners]] object of the EventDispatcher
     */
    constructor(dispatcher, type, handler, useCapture, priority) {
        super();
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
    dispose() {
        if (this.dispatcher) {
            this.dispatcher.removeEventListener(this.type, this.handler, this.useCapture);
            this.dispatcher = null;
        }
        super.dispose();
    }
}

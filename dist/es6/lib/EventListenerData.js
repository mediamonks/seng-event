import Disposable from "seng-disposable";
export default class EventListenerData extends Disposable {
    constructor(dispatcher, type, listener, useCapture, priority) {
        super();
        this.dispatcher = dispatcher;
        this.type = type;
        this.listener = listener;
        this.useCapture = useCapture;
        this.priority = priority;
    }
    dispose() {
        if (this.dispatcher) {
            this.dispatcher.removeEventListener(this.type, this.listener, this.useCapture);
            this.dispatcher = null;
        }
    }
}

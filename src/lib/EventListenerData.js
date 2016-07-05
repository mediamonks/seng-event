"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var seng_disposable_1 = require("seng-disposable");
var EventListenerData = (function (_super) {
    __extends(EventListenerData, _super);
    function EventListenerData(dispatcher, type, listener, useCapture, priority) {
        _super.call(this);
        this.dispatcher = dispatcher;
        this.type = type;
        this.listener = listener;
        this.useCapture = useCapture;
        this.priority = priority;
    }
    EventListenerData.prototype.dispose = function () {
        if (this.dispatcher) {
            this.dispatcher.removeEventListener(this.type, this.listener, this.useCapture);
            this.dispatcher = null;
        }
    };
    return EventListenerData;
}(seng_disposable_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventListenerData;

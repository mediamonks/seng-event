"use strict";
var CallListenerResult;
(function (CallListenerResult) {
    CallListenerResult[CallListenerResult["NONE"] = 0] = "NONE";
    CallListenerResult[CallListenerResult["PROPAGATION_STOPPED"] = 1] = "PROPAGATION_STOPPED";
    CallListenerResult[CallListenerResult["IMMEDIATE_PROPAGATION_STOPPED"] = 2] = "IMMEDIATE_PROPAGATION_STOPPED";
})(CallListenerResult || (CallListenerResult = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CallListenerResult;

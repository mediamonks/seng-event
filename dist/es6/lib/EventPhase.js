var EventPhase;
(function (EventPhase) {
    EventPhase[EventPhase["NONE"] = 0] = "NONE";
    EventPhase[EventPhase["CAPTURING_PHASE"] = 1] = "CAPTURING_PHASE";
    EventPhase[EventPhase["AT_TARGET"] = 2] = "AT_TARGET";
    EventPhase[EventPhase["BUBBLING_PHASE"] = 3] = "BUBBLING_PHASE";
})(EventPhase || (EventPhase = {}));
export default EventPhase;

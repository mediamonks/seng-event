import EventDispatcher, { createEventClass } from 'seng-event';

class TestEvent extends createEventClass<{ foo: number }>()('A', 'B') {}

class UntypedDispatcher extends EventDispatcher {
    // tslint:disable-next-line
    public test() {
        // $ExpectType boolean
        this.dispatchEvent(new TestEvent(TestEvent.types.A, { foo: 2 }));
    }
}

const untypedDispatcherInstance = new UntypedDispatcher();

untypedDispatcherInstance.addEventListener(TestEvent.types.A, (event) => {
    // $ExpectType any
    event;
});

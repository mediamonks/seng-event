export const EVENT_TYPE_PLACEHOLDER = '__EventTypeUtil::EVENT_TYPE_PLACEHOLDER';
export const generateEventTypes = (targets) => {
    Object.keys(targets).forEach(name => {
        const target = targets[name];
        Object.keys(target).forEach(prop => {
            if (target[prop] === EVENT_TYPE_PLACEHOLDER) {
                target[prop] = `${name}/${prop}`;
            }
        });
    });
};

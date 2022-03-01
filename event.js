export default function Index(){
    const handleClick = () => {}
    const handleClickCapture = () => {}
    return <div>
        <button onClick={handleClick} onClickCapture={handleClickCapture}></button>
    </div>
}


export default function Index(){
    const handleClick = (e) => {
        e.stopPropagation()
    }
    const handleFatherClick = () => {}
    return <div onClick={handleFatherClick}>
        <button onClick={handleClick}></button>
    </div>
}


const registrationNameModules = {
    onBlur: SimpleEventPlugin,
    onClick: SimpleEventPlugin
}

const registrationNameDependencies = {
    onBlur: ['blur'],
    onClick: ['click'],
    onChange: ['blur', 'change', 'click', 'focus', 'input']
}

function diffProperties(){
    if(registrationNameModules.hasOwnProperty(propKey)){
        legacyListenToEvent(registrationName, document)
    }
}

function legacyListenToEvent(registrationName, mountAt){
    const dependencies = registrationNameDependencies[registrationName];
    for(let i = 0; i < dependencies.length; i++){
        const dependency = dependencies[i]
    }
}

const listener = dispatchEvent.bind(null, 'click', eventSystemFlags, document);
document.addEventListener('click', listener, false)

function batchedEventUpdates(fn, a){
    isBatchingEventUpdates = true;
    try{
        fn(a)
    } finally{
        isBatchingEventUpdates = false;
    }
}

while(instance !== null){
    const {stateNode, tag} = instance;
    if(tag === HostComponent && stateNode !== null){
        const currentTarget = stateNode;
        if(captured !== null){
            const captureListener = getListener(instance, captured);
            if(captureListener !== null){
                dispatchListeners.unshift(captureListener)
            }
        }
        if(bubbled !== null){
            const bubbleListener = getListener(instance, bubbled);
            if(bubbleListener !== null){
                dispatchListeners.push(bubbleListener);
            }
        }
    }
    instance = instance.return;
}

function runEventsInBatch(){
    const dispatchListeners = event._dispatchListeners;
    if(Array.isArray(dispatchListeners)){
        for(let i = 0; i < dispatchListeners.length; i++){
            if(event.isPropagationStopped()){
                break;
            }
            dispatchListeners[i](evnet);
        }
    }
}
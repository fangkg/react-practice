const HooksDispatcherOnMount = {
    useState: mountState,
    useEffect: mountEffect
}

const HooksDispatcherOnUpdate = {
    useState: updateState,
    useEffect: updateEffect
}

const ContextOnlyDispatcher = {
    useEffect: throwInvalidHookError,
    useState: throwInvalidHookError
}

let currentlyRenderingFiber;
function renderWithHooks(current, workInProgress, Component, props){
    currentlyRenderingFiber = workInProgress;
    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;
    ReactCurrentDispatcher.current = current === null || current.memoizedState === null ? HooksDispatcherOnMount: HooksDispatcherOnUpdate;
    let children = Component(props, secondArg);
    ReactCurrentDispatcher.current = ContextOnlyDispatcher;
}

function mountWorkInProgressHook(){
    const hook = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
    }
    if(workInProgressHook === null){
        currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    } else {
        workInProgressHook = workInProgressHook.next = hook;
    }
    return workInProgressHook;
}

const [number, setNumber] = React.useState(0);

function mountState(initialState){
    const hook = mountWorkInProgressHook();
    if(typeof initialState === 'function'){
        initialState = initialState();
    }
    hook.memoizedState = hook.baseState = initialState;
    const queue = (hook.queue = {})
    const dispatch = (queue.dispatch = (dispatchAction.bind(null, currentlyRenderingFiber, queue)))
    return [hook.memoizedState, dispatch]
}

function dispatchAction(fiber, queue, action){
    const update = {}
    const pending = queue.pending;
    if(pending === null){
        update.next = update;
    } else {
        update.next = pending.next;
        pending.next = update;
    }

    if(fiber === currentlyRenderingFiber){

    } else {
        if(fiber.expirationTime === NoWork && (alternate === null || alternate.expirationTime === NoWork)){
            const lastRenderedReducer = queue.lastRenderedReducer;
            const currentState = queue.lastRenderedState;
            const eagerState = lastRenderedReducer(currentState, action);
            if(isFinite(eagerState, currentState)){
                return
            }
        }
        scheduleUpdateOnFiber(fiber, expirationTime);
    }
}

function updateReducer(){
    const first = baseQueue.next;
    let update = first;
    do{
        newState = reducer(newState, action);
    } while(update !== null && update !== first){
        hook.memoizedState = newState;
        return [hook.memoizedState, dispatch]
    }
}

function mountEffect(create, deps){
    const hook = mountWorkInProgressHook();
    const nextDeps = deps === undefined ? null : deps;
    currentlyRenderingFiber.effectTag |= UpdateEffect | PassiveEffect;
    hook.memoizedState = pushEffect(
        HookHasEffect | hookEffectTag,
        create,
        undefined,
        nextDeps
    )
}

function updateEffect(create, deps){
    const hook = updateWorkInProgressHook();
    if(areHookInputsEqual(nextDeps, prevDeps)){
        pushEffect(hookEffectTag, create, destroy, nextDeps);
        return;
    }
    currentlyRenderingFiber.effectTag |= fiberEffectTag;
    hook.memoizedState = pushEffect(HookHasEffect | hookEffectTag, create, destroy, nextDeps);
}

function mountRef(initialValue){
    const hook = mountWorkInProgressHook();
    const ref = {
        current: initialValue
    }
    hook.memoizedState = ref;
    return ref;
}

function updateRef(initialValue){
    const hook = updateWorkInProgressHook();
    return hook.memoizedState;
}

function mountMemo(nextCreate, deps){
    const hook = mountWorkInProgressHook();
    const nextDeps = deps === undefined ? null : deps;
    const nextValue = nextCreate();
    hook.memoizedState = [nextCreate, nextDeps];
    return nextValue;
}

function updateMemo(nextCreate, nextDeps){
    const hook = updateWorkInProgressHook();
    const prevState = hook.memoizedState;
    const prevDeps = prevState[1];
    if(areHookInputsEqual(nextDeps, prevDeps)){
        return prevState[0]
    }
    const nextValue = nextCreate();
    hook.memoizedState = [nextValue, nextDeps];
    return nextValue;
}
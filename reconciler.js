function FiberNode(){
    this.tag = tag;
    this.key = key;
    this.type = null;
    this.stateNode = null;
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.dependencies = null;
    this.mode = mode;
    this.effectTag = NoEffect;
    this.nextEffect = null;
    this.firstEffect = null;
    this.lastEffect = null;
    this.expirationTime = NoWork;
    this.alternate = null;
}

export default class Index extends React.Component{
    state = {
        number: 60
    }
    handleClick = () => {
        this.setState({
            number: this.state.number + 1
        })
    }

    render(){
        return <div>
            <span>{this.state.number}</span>
            <button onClick={this.handleClick}></button>
        </div>
    }
}

// fiberRoot
// rootFiber
ReactDom.render(<Index/>, document.getElementById('#app'))

function createFiberRoot(containerInfo, tag){
    const root = new FiberRootNode(containerInfo, tag);
    const rootFiber = createHostRootFiber(tag);
    root.current = rootFiber;
    return root;
}

currentFiber.alternate = workInProgressFiber
workInProgressFiber.alternate = currentFiber


function workLoop(){
    while(workInProgress !== null){
        workInProgress = performUnitOfWork(workInProgress);
    }
}

function performUnitOfWork(){
    next = beginWork(current, unitOfWork, renderExpirationTime);
    if(next === null){
        next = completeUnitOfWork(unitOfWork);
    }
}

function beginWork(current, workInProgress){
    switch(workInProgress.tag){
        case InterminateComponent: {

        }
        case FunctionComponent: {

        }
        case ClassComponent: {

        }
        case HostComponent: {

        }
    }
}

function reconcileChildren(current, workInProgress){
    if(current === null){
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime)
    } else {
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderExpirationTime)
    }
}

function commitBeforeMutationEffects(){
    while(nextEffect !== null){
        const effectTag = nextEffect.effectTag;
        if((effectTag & Snapshot) !== NoEffect) {
            const current = nextEffect.alternate;
            commitBeforeMutationEffectOnFiber(current, nextEffect);
        }

        if((effectTag & Passive) !== NoEffect){
            scheduleCallback(NormalPriority, () => {
                flushPassvieEffects();
                return null;
            })
        }

        nextEffect = nextEffect.nextEffect;
    }
}

function commitMutationEffects(){
    while(nextEffect !== null){
        if(effectTag & Ref){
            const current = nextEffect.alternate;
            if(current !== null){
                commitDetachRef(current)
            }
        }
        switch(primaryEffectTag){
            case Placement: {}
            case Update: {}
            case Deletion: {}
        }
    }
}

function commitLayoutEffects(root){
    while(nextEffect !== null){
        const effectTag = nextEffect.effectTag;
        commitLayoutEffectOnFiber(root, current, nextEffect, committedExpirationTime)
        if(effectTag & Ref){
            commitAttachRef(nextEffect)
        }
    }
}
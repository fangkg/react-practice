function requestIdleCallback(callback, {timeout})

Immediate
UserBlocking
Normal
Low
Idle


let time = 0;
let nowTime = +new Date();
let timer;
const poll = function(){
    timer = setTimeout(() => {
        const lastTime = nowTime;
        nowTime = +new Date();
        poll()
    }, 0)
    time++;
    if(time === 20) clearTimeout(timer)
}

let scheduleHostCallback = null
let channel = new MessageChannel();
let port = channel.port2;

channel.port1.onmessage = function(){
    scheduleHostCallback();
    scheduleHostCallback = null;
}

requestHostCallback = function(callback){
    scheduleHostCallback = callback;
    if(!isMessageLoopRunning){
        isMessageLoopRunning = true;
        port.postMessage(null);
    }
}

function workLoopSync(){
    while(workInProgress !== null){
        workInProgress = performUnitOfWork(workInProgress)
    }
}

function workLoopConcurrent(){
    while(workInProgress !== null && !shouldYield){
        workInProgress = performUnitOfWork(workInProgress);
    }
}

function scheduleCallback(Immediate, workLoopSync){}

let priorityLevel = inferPriorityFromExpirationTime(currentTime, expirationTime);
scheduleCallback(priorityLevel, workLoopConcurrent);

function scheduleCallback(){
    const expirationTime = startTime + timeout;
    const newTask = {};
    if(startTime > currentTime){
        newTask.sortIndex = startTime;
        push(timerQueue, newTask);
        requestHostTimeout(handleTimeout, startTime - currentTime);
    } else {
        newTask.sortIndex = expirationTime;
        push(taskQueue, newTask);
        if(!isHostCallbackScheduled && !isPerformingWork){
            isHostCallbackScheduled = true;
            requestHostCallback(flushWork);
        }
    }
}


const requestHostTimeout = function(cb, ms){
    _timeoutID = setTimeout(cb, ms);
}

const cancelHostTimeout = function(){
    clearTimeout(_timeoutID);
}

function handleTimeout(){
    isHostTimeoutScheduled = false;
    advanceTimers(currentTime);
    if(!isHostCallbackScheduled) {
        if(peek(taskQueue) !== null){
            isHostCallbackScheduled = true;
            requestHostCallback(flushWork)
        }
    }
}

function advanceTimers(){
    let timer = peek(timerQueue);
    while(timer !== null){
        if(timer.callback === null){
            pop(timerQueue)
        } else if(timer.startTime <= currentTime){
            pop(timerQueue);
            timer.sortIndex = timer.expirationTime;
            push(taskQueue, timer);
        }
    }
}

function flushWork(){
    if(isHostTimeoutScheduled){
        isHostTimeoutScheduled = false;
        cancelHostTimeout();
    }
    try{
        workLoop(hasTimeRemaining, initialTime)
    } catch(e){}
}

function workLoop(){
    let currentTime = initialTime;
    advanceTimers(currentTime);
    currentTask = peek();
    while(currentTask !== null){
        let callback = currentTask.callback;
        if(callback !== null){
            callback()
            advanceTimers(currentTime);
        }
        currentTask = peek(taskQueue);
    }
}

function unstable_shouldYield(){
    let currentTime = exports.unstable_now();
    advanceTimers(currentTime);
    let firstTask = peek(taskQueue);
    return firstTask !== currentTask
        && currentTask !== null
        && firstTask !== null
        && firstTask.callback !== null
        && firstTask.startTime <= currentTime
        && firstTask.expirationTime < currentTask.expirationTime
        || shouldYieldToHost()
}
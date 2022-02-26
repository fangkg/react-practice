const setState = (obj, callback) => {}

setState((state, props) => {
    return {
        number: 1
    }
})

this.setState({
    number: 1
}, () => {
    console.log(this.state.number)
})


// 更新流程：
// 触发setState
// 计算expirationTime
// 更新调度，调和fiber树
// 合并state，执行render
// 替换真实dom
// 执行callback函数

// render阶段render函数执行
// commit阶段真实DOM替换
// setState回调函数执行callback

function enqueueSetState(){
    const update = createUpdate(expirationTime, suspenseConfig);
    callback && (update.callback = callback);
    enqueueUpdate(fiber, update);
    scheduleUpdateOnFiber(fiber, expirationTime);
}

function dispatchEventForLegacyPluginEventSystem(){
    batchedEventUpdates(handleTopLevel, bookKeeping)
}

function batchedEventUpdates(fn, a){
    isBatchingEventUpdates = true;
    try{
        return batchedEventUpdatesImpl(fn, a, b)
    } finally{
        isBatchingEventUpdates = false;
    }
}

import React from 'react'
import ReactDOM from 'react-dom';
const { unstable_batchUpdates} = ReactDOM;
export default class index extends React.Component{
    state = {
        number: 0
    }

    handleClick = () => {
        this.setState({
            number: this.state.number + 1
        }, () => {
            console.log('callback1', this.state.number)
        })
        console.log(this.state.number)

        setTimeout(() => {
            unstable_batchUpdates(() => {
                this.setState({
                    number: this.state.number + 1
                })
                console.log(this.state.number)
            })
        })

        ReactDOM.flushSync(() => {
            this.setState({
                number: 3
            })
        })

        this.setState({
            number: 4
        })
    }

    render(){
        return <div>
            {
                this.state.number
            }
            <button onClick={this.handleClick}></button>
        </div>
    }
}

[state, dispatch] = useState(initData);
const [number, setNumber] = useState(0);
const handleClick = () => {
    setNumber(1)
}

const [num, setNum] = React.useState(() => {
    if(props.a === 1) return Math.random()
    if(props.a === 2) return Math.ceil(Math.random() * 10)
    return Math.ceil(Math.random() * 100)
})

const handleClick = () => {
    setNum((state) => state + 1)
}

export default function Index(props){
    const [number, setNumber] = React.useState(0);
    React.useEffect(() => {

    }, number)

    const handleClick = () => {
        ReactDOM.flushSync(() => {
            setNumber(3)
        })
        setNumber(4);

        setTimeout(() => {
            setNumber(5)
        })
    }

    return <div>
        <span>{number}</span>
        <button onClick={handleClick}>+</button>
    </div>
}

export default function Index(){
    const [state, dispatchState] = useState({
        name: 'alien'
    })

    const handleClick = () => {
        state.name = 'll'
        dispatchState(state)// state相同不更新
        dispatchState({...state}) // state不同更新
    }

    return <div>
        <span>{state.name}</span>
        <button onClick={handleClick}></button>
    </div>
}
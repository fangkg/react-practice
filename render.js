function Children({number}){
    return <div>{number}</div>
}

export default class Index extends React.Component{
    state = {
        numberA: 0,
        numberB: 0
    }

    render(){
        return <div>
            <Children number={this.state.numberA}/>
            <button onClick={() => this.setState({numberA: this.state.numberA + 1})}>+</button>
            <button onClick={() => this.setState({numberB: this.state.numberB + 1})}></button>
        </div>
    }
}

export default class Index extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            numberA: 0,
            numberB: 0
        }
        this.component = <Children number={this.state.numberA}/>
    }

    controllComponentRender = () => {
        const { props } = this.component
        if(props.number !== this.state.numberA){
            return this.component = React.cloneElement(this.component, {number: this.state.numberA})
        }
        return this.component;
    }

    render(){
        return <div>
            {this.controllComponentRender()}
            <button onClick={() => this.setState({numberA: this.state.numberA + 1})}></button>
            <button onClick={() => this.setState({numberB: this.state.numberB + 1})}></button>
        </div>
    }
}


export default function Index(){
    const [numberA, setNumberA] = React.useState(0);
    const [numberB, setNumberB] = React.useState(0);
    return <div>
        {
            React.useMemo(() => <Children number={numberA}/>, [numberA])
        }
        <button onClick={() => setNumberA(numberA + 1)}>+</button>
        <button onClick={() => setNumberB(numberB + 1)}></button>
    </div>
}


class Children extends React.PureComponent{
    state = {
        name: 'alien',
        age: 18,
        obj: {
            number: 1
        }
    }

    changeObjNumbe = () => {
        const { obj } = this.state;
        obj.number++;
        this.setState({obj})
        this.setState({obj: {...obj}})
    }

    render(){
        return <div>
            <button onClick={() => this.setState({name: 'alien'})}></button>
            <button onClick={() => this.setState({age: this.state.age + 1})}></button>
            <button onClick={this.changeObjNumbe}></button>
        </div>
    }
}

export default function Home(){
    const [numberA, setNumberA] = React.useState(0);
    const [numberB, setNumberB] = React.useState(0);
    return <div>
        <button onClick={() => setNumberA(numberA + 1)}></button>
        <button onClick={() => setNumberB(numberB + 1)}></button>
        <Children number={numberA}/>
    </div>
}

function checkShouldComponentUpdate(){
    if(typeof instance.shouldComponentUpdate === 'function'){
        return instance.shouldComponentUpdate(newProps, newState, nextContext);
    }
    if(ctor.prototype && ctor.prototype.isPureReactComponent){
        return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
    }
}

class Index extends React.PureComponent{}
export default function(){
    const callback = React.useCallback(function handleCallback(){}, [])
    return <Index callback={callback}/>
}

class Index extends React.Component{
    state = {
        stateNumA: 0,
        stateNumB: 0
    }

    shouldComponentUpdate(newProp, newState, newContext){
        if(newProp.propsNumA !== this.props.propsNumA || newState.stateNumA !== this.state.stateNumA){
            return true
        }
        return false
    }

    render(){
        const {stateNumA, stateNumB} = this.state;
        return <div>
            <button onClick={() => this.setState({
                stateNumA: stateNumA + 1
            })}></button>
            <button onClick={() => this.setState({
                stateNumB: stateNumB + 1
            })}></button>
        </div>
    }
}

export default function Home(){
    const [numberA, setNumberA] = React.useState(0)
    const [numberB, setNumberB] = React.useState(0)
    return <div>
        <button onClick={() => setNumberA(numberA + 1)}></button>
        <button onClick={() => setNumberB(numberB + 1)}></button>
        <Index propsNumA={numberA} propsNumB={numberB}/>
    </div>
}

function memo(type, compare){
    const elementType = {
        $$typeof: REACT_MEMO_TYPE,
        type,
        compare: compare === undefined ? null : compare
    }
    return elementType;
}

function updateMemoComponent(){
    if(updateExpirationTime < renderExpirationTime){
        let compare = Component.compare;
        compare = compare !== null ? compare : shallowEqual;
        if(compare(prevProps, nextProps) && current.ref === workInProgress.ref){
            return bailoutOnAlreadyFinishedWork(current, workInProgress, renderExpirationTime);
        }
    }
}

function TextMemo(props){
    return <div>hello</div>
}

const controllIsRender = (pre, next) => {
    return (pre.number === next.number) || (pre.number !== next.number && next.number > 5);
}

const NewTextMemo = React.memo(TextMemo, controllIsRender);
class Index extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            number: 1,
            num: 1
        }
    }

    render(){
        const {num, number} = this.state;
        return <div>
            <button onClick={() => this.setState({num: num + 1})}></button>
            <button onClick={() => this.setState({number: number - 1})}></button>
            <NewTextMemo num={num} number={number}/>
        </div>
    }
}
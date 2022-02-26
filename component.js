class textClass{
    sayHello = () => console.log('text')
}

class Index extends React.Component{
    state = {
        message: 'hello'
    }

    sayHello = () => this.setState({
        message: 'alien'
    })

    render(){
        return <div style={{marginTop: '50px'}} onClick={this.sayHello()}>
            {this.state.message}
        </div>
    }
}

function textFn(){
    return 'hello'
}

function FnComponent(){
    const [message, setMessage] = useState('hello world');
    return <div onClick={() => setMessage('lllll')}>{message}</div>
}


function constructClassInstance(workInProgress, ctor, props){
    const instance = new ctor(props, context);
}

function renderWithHooks(current, workInProgress, Component, props, secondArg, nextRenderExpirationTime){
    let children = Component(props, secondArg);
}

function Component(props, context, updater){
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.setState = function(partialState, callback){
    this.updater.enqueueSetState(this, partialState, callback, 'setState')
}

Component.prototype.forceUpdate = function(callback){
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate')
}


class Index extends React.Component{
    constructor(...arg){
        super(...arg)
    }

    state = {}
    static number = 1;
    handleClick = () => console.log('click')

    componentDidMount() {
        console.log(Index.number, Index.number1)
    }

    render(){
        return <div style={{marginTop: '50px'}} onClick={this.handleClick}>react</div>
    }
}

Index.number1 = 3;
Index.prototype.handleClick = () => console.log(2)

function Index(){
    console.log(Index.number)
    const [message, setMessage] = useState('hello world');
    return <div onClick={() => setMessage('us')}>{message}</div>
}
Index.number = 5

function Son(props){
    const {fatherSay, sayFather} = props
    return <div className="son">
        子组件
        <div>{fatherSay}</div>
        <input placeholder="子组件说" onChange={(e) => sayFather(e.target.value)}></input>
    </div>
}

function Father(){
    const [childSay, setChildSay] = useState("")
    const [fatherSay, setFatherSay] = useState("")
    return <div className="box father">
        父组件
        <div>{childSay}</div>
        <input placeholder="父说" onChange={(e) => setFatherSay(e.target.value)}></input>
        <Son fatherSay={fatherSay} sayFather={setChildSay}/>
    </div>
}

function Son(){
    const [fatherSay, setFatherSay] = useState("")
    React.useEffect(() => {
        BusService.on('fatherSay', (value) => {
            setFatherSay(value)
        })

        return function() {
            BusService.off('fatherSay')
        }
    }, [])

    return <div className="son">
        子组件
        <div>{fatherSay}</div>
        <input placeholder="父组件说" onChange={(e) => BusService.emit('childSay', e.target.value)}></input>
    </div>
}

function Father(){
    const [childsSay, setChildSay] = useState("")
    React.useEffect(() => {
        BusService.on('childSay', (value) => {
            setChildSay(value)
        })

        return function(){
            BusService.off('childSay')
        }
    }, [])

    return <div className="box father">
        父组件
        <div>{childSay}</div>
        <input placeholder="子组件" onChange={(e) => BusService.emit('fatherSay', e.target.value)}></input>
        <Son/>
    </div>
}

class Person extends React.Component{
    constructor(props){
        super(props)
    }

    componentDidMount(){

    }
    eat(){}
    sleep(){}
    render(){
        return <div>person</div>
    }
}

class Programmer extends Person{
    constructor(props){
        super(props)
    }

    componentDidMount(){}

    code(){}

    render(){
        return <div style={{marginTop: '50px'}}>
            {super.render()}
        </div>
    }
}

export default Programmer;
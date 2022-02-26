import React, { useEffect, useImperativeHandle } from "react";
import { HostComponent } from "./jsx";

class Index extends React.Component{
    constructor(props){
        super(props)
        this.currentDom = React.createRef(null);
    }

    componentDidMount(){

    }

    render = () => <div ref={this.currentDom}></div>
}

function createRef(){
    const refObject = {
        current: null
    }
    return refObject;
}


export default function Index(){
    const currentDom = React.useRef(null)
    React.useEffect(() => {

    }, [])
    return <div ref={currentDom}></div>
}

class Children extends Component{
    render = () => <div>child</div>
}

export default class Index extends React.Component{
    currentDom = null
    currentComponentInstance = null
    currentRef = React.createRef(null)
    currentInstanceRef = React.createRef(null)

    componentDidMount(){}
    render = () => <div>
        <div ref="currentDOM"></div>
        <div ref={(node) => this.currentDom = node}></div>
        <div ref={this.currentRef}></div>
        <Children ref={(node) => this.currentComponentInstance = node}/>
        <Children ref="currentDomInstance"/>
        <Children ref={this.currentInstanceRef}/>
    </div>
}


function Son(props){
    const {grandRef} = props;
    return <div>
        <div>alien</div>
        <div ref={grandRef}></div>
    </div>
}

class Father extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return <div>
            <Son grandRef={this.props.grandRef}/>
        </div>
    }
}

const NewFather = React.forwardRef((props, ref) => <Father grandRef={ref} {...props}/>)

class GrandFather extends React.Component{
    constructor(props){
        super(props)
    }
    node = null
    componentDidMount(){}

    render(){
        return <div>
            <NewFather ref={(node) => this.node = node}/>
        </div>
    }
}


class Form extends React.Component{
    render(){
        return <div></div>
    }
}


class Index extends React.Component{
    componentDidMount(){
        const {forwardRef} = this.props;
        forwardRef.current = {
            form: this.form,
            index: this,
            button: this.button
        }
    }

    form = null
    button = null
    render(){
        return <div>
            <button ref={(button) => this.button = button}></button>
            <Form ref={(form) => this.form = form}/>
        </div>
    }
}

const ForwardRefIndex = React.forwardRef((props, ref) => <Index {...props} forwardRef={ref}/>)

export default function Home(){
    const ref = useRef(null)
    useEffect(() => {

    }, [])
    return <ForwardRefIndex ref={ref}/>
}


function HOC(Component){
    class Wrap extends React.Component{
        render(){
            const {forwardedRef, ...otherprops} = this.props;
            return <Component ref={forwardedRef} {...otherprops}/>
        }
    }

    return React.forwardRef((props, ref) => <Wrap forwardRef={ref} {...props}/>)
}

class Index extends React.Component{
    render(){
        return <div>hello</div>
    }
}

const HocIndex = HOC(Index)
export default () => {
    const node = useRef(null)
    useEffect(() => {

    }, [])
    return <div>
        <HocIndex ref={node}/>
    </div>
}

class Son extends React.PureComponent{
    state = {
        fatherMes: '',
        sonMes: ''
    }
    fatherSay = (fatherMes) => this.setState({
        fatherMes
    })
    render(){
        const {fatherMes, sonMes} = this.state
        return <div className="sonbox">
            <div className="title">child</div>
            <p>{fatherMes}</p>
            <div className="label">say to father comp
                <input onChange={(e) => this.setState({
                    sonMes: e.target.value
                })} className="input"></input>
                <button className="searchbtn" onClick={() => this.props.toFather(sonMes)}>to father</button>
            </div>
        </div>
    }
}

export default function Father(){
    const [sonMes, setSonMes] = React.useState("");
    const sonInstance = React.useRef(null);
    const [fatherMes, setFatherMes] = React.useState("");
    const toSon = () => sonInstance.current.fatherSay(fatherMes);
    return <div className="box">
        <div className="title">父组件</div>
        <p>{sonMes}</p>
        <div className="label">
            <input onChange={(e) => setFatherMes(e.target.value)} className="input"></input>
            <button className="searchbtn" onClick={toSon}>to son</button>
            <Son ref={sonInstance} toFather={setSonMes}></Son>
        </div>
    </div>
}

function Son(props, ref){
    const inputRef = useRef(null)
    const [inputValue, setInputValue] = useState("")
    useImperativeHandle(ref, () => {
        const handleRefs = {
            onFocus(){
                inputRef.current.focus()
            },
            onChangeValue(value){
                setInputValue(value)
            }
        }
        return handleRefs;
    }, [])

    return <div>
        <input placeholder="content" ref={inputRef} value={inputValue}></input>
    </div>
}

const ForwardSon = React.forwardRef(Son);

class Index extends React.Component{
    cur = null;
    handleClick(){
        const {onFocus, onChangeValue} = this.cur;
        onFocus()
        onChangeValue('let')
    }

    render(){
        return <div style={{marginTop: '50px'}}>
            <ForwardSon ref={ cur => (this.cur = cur)}/>
            <button onClick={this.handleClick.bind(this)}></button>
        </div>
    }
}

const toLearn = [
    {
        type: 1,
        mes: 'react'
    },
    {
        type: 2,
        mes: 'vue'
    }
]

export default function Index({id}){
    const typeInfo = React.useRef(toLearn[0])
    const changeType = (info) => {
        typeInfo.current = info
    }

    useEffect(() => {

    }, [id])

    return <div>
        {
            toLearn.map(item => <button key={item.key} onClick={changeType.bind(null, item)}>{item.mes}</button>)
        }
    </div>
}

function commitDetachRef(current){
    const currentRef = current.ref;
    if(currentRef !== null){
        if(typeof currentRef === 'function'){
            currentRef(null);
        } else {
            currentRef.current = null;
        }
    }
}

function commitAttachRef(finishedWork){
    const ref = finishedWork.ref;
    if(ref !== null){
        const instance = finishedWork.stateNode;
        let instanceToUse;
        switch(finishedWork.tag){
            case HostComponent:
                instanceToUse = getPublicInstance(instance)
                break;
            default:
                instanceToUse = instance
        }

        if(typeof ref === 'function'){
            ref(instanceToUse)
        } else {
            ref.current = instanceToUse
        }
    }
}


const ref = function(value){
    let refs = inst.refs;
    if(refs === emptyRefsObject){
        refs = inst.refs = {}
    }
    if(value === null){
        delete refs[stringRef];
    } else {
        refs[stringRef] = value;
    }
}

function commitMutationEffects(){
    if(effectTag & Ref){
        const current = nextEffect.alternate;
        if(current !== null){
            commitDetachRef(current)
        }
    }
}

function commitLayoutEffects(){
    if(effectTag & Ref){
        commitAttachRef(nextEffect)
    }
}

function markRef(current, workInProgress){
    const ref = workInProgress.ref;
    if((current === null && ref !== null) || (current !== null && current.ref !== ref)){
        workInProgress.effectTag |= Ref;
    }
}

export default class Index extends React.Component{
    state = {
        num: 0
    }
    node = null
    getDom = (node) => {
        this.node = node
    }
    render(){
        return <div>
            <div ref={this.getDom}></div>
            <button onClick={() => this.setState({
                num: this.state.num + 1
            })}></button>
            {
                this.state.isShow && <div ref={() => this.node = node}></div>
            }
        </div>
    }
}

function safelyDetachRef(current){
    const ref = current.ref;
    if(ref !== null){
        if(typeof ref === 'function'){
            ref(null)
        } else {
            ref.current = null;
        }
    }
}
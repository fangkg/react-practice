import React, { useEffect } from "react";
import { render } from "react-dom";
import { ClassComponent } from "./jsx";

function updateClassComponent(){
    let shouldUpdate
    const instance = workInProgress.stateNode
    if(instance === null){
        constructClassInstance(workInProgress, Component, nextProps)
        mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
        shouldUpdate = true;
    } else {
        shouldUpdate = updateClassInstance(current, workInProgress, Component, nextProps, renderExpirationTime);
    }

    if(shouldUpdate){
        nextChildren = instance.render();
        reconcileChildren(current, workInProgress, nextChildren, renderExpirationTime);
    }
}

function mountClassInstance(workInProgress, ctor, newProps, renderExpirationTime){
    const instance = workInProgress.stateNode
    const getDerivedStateFromProps = ctor.getDerivedStateFromProps();
    if(typeof getDerivedStateFromProps === 'function'){
        const patialState = getDerivedStateFromProps(nextProps, prevState);
        const memoizedState = patialState === null || partialState === undefined
            ? prevState
            : Object.assign({}, prevState, partialState)
        workInProgress.memoizedState = memoizedState
        instance.state = workInProgress.memoizedState
    }
    if(typeof ctor.getDerivedStateFromProps !== 'function' && typeof instance.getSnapshotBeforeUpdate !== 'function' && instance.componentWillMount === 'function'){
        instance.componentWillMount()
    }
}

function commitLifeCycles(finishRoot, current, finishedWork){
    switch(finishedWork.tag){
        case ClassComponent: {
            const instance = finishedWork.stateNode
            if(current === null){
                instance.componentDidMount()
            } else {
                instance.componentDidUpdate(prevProps, prevState, instance._reactInternalSnapshotBeforeUpdate)
            }
        }
    }
}

// constructor
// getDerivedStateFromProps / componentWillMount
// render
// componentDidMount


function updateClassInstance(current, workInProgress, ctor, newProps, renderExpirationTime){
    const instance = workInProgress.stateNode;
    const hasNewLifeCycles = typeof ctor.getDerivedStateFromProps === 'function';
    if(!hasNewLifeCycles && typeof instance.componentWillReceiveProps === 'function'){
        if(oldProps !== newProps || oldContext !== newContext){
            instance.componentWillReceiveProps(newProps, newContext);
        }
    }

    let newState = (instance.state = oldstate);
    if(typeof getDerivedStateFromProps === 'function'){
        ctor.getDerivedStateFromProps(nextProps, prevState);
        newState = workInProgress.memoizedState;
    }

    let shouldUpdate = true;
    if(typeof instance.shouldComponentUpdate === 'function'){
        shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
    }

    if(shouldUpdate){
        if(typeof instance.componentWillUpdate === 'function'){
            instance.componentWillUpdate()
        }
    }

    return shouldUpdate;
}


function commitBeforeMutationLifeCycles(current, finishedWork){
    switch(finishedWork.tag){
        case ClassComponent: {
            const snapshot = instance.getSnapshotBeforeUpdate(prevProps, prevState);
            instance.__reactInternalSnapshotBeforeUpdate = snapshot;
        }
    }
}

// componentWillReceiveProps / getDerivedStateFromProps
// shouldComponentUpdate
// componentWillUpdate
// render
// getSnapshotBeforeUpdate
// componentDidUpdate

function callComponentWillUnmountWithTimer(){
    instance.componentWillUnmount()
}

class Index extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name: 'alien'
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleInputChange = debounce(this.handleInputChange, 500);
        const _render = this.render
        this.render = function(){
            return _render.bind(this)
        }
    }

    handleClick(){

    }

    handleInputChange(){

    }

    componentDidMount(){
        this.node.addEventListener('click', () => {})
        const data = await this.getData()
    }

    shouldComponentUpdate(newProps, newState){
        return true;
    }

    getSnapshotBeforeUpdate(prevProps, preState){
        const style = getComputedStyle(this.node);
        return {
            cx: style.cx,
            cy: style.cy
        }
    }

    componentDidUpdate(prevProps, preState, snapshot){
        const style = getComputedStyle(this.node);
        const newPosition = {
            cx: style.cx,
            cy: style.cy
        }
    }

    componentWillUnmount(){
        clearTimeout(this.timer)
        this.node.removeEventListener('click', this.handleClick)
    }
}


function Index(){
    useEffect(() => {

    }, dep)

    useEffect(() => {
        return function componentWillUnmount(){

        }
    }, [])

    useEffect(() => {

    }, [props.number])

    useEffect(() => {

    })
    return <div>index</div>
}

function FunctionLifecycle(props){
    const [num, setNum] = useState(0)
    React.useEffect(() => {
        return function componentWillUnmount(){

        }
    }, [])

    React.useEffect(() => {

    }, [props])

    React.useEffect(() => {

    })

    return <div>
        <span>{props.number}</span>
        <span>{num}</span>
        <button onClick={() => setNum(state => state + 1)}></button>
    </div>
}

export default () => {
    const [number, setNumber] = React.useState(0)
    const [isRender, setRender] = React.useState(true)
    return <div>
        {
            isRender && <FunctionLifecycle number={number}/>
        }
        <button onClick={() => setNumber(state => state + 1)}></button>
        <button onClick={() => setRender(false)}></button>
    </div>
}


function Item({item}){
    return <div className="goods_item">
        <img src={item.giftImage} className="item_image"/>
        <div className="item_content">
            <div className="goods_name">
                {
                    item.giftName
                }
            </div>
            <div className="hold_price"></div>
            <div className="new_price">
                <div className="new_price">
                    <div className="one view">
                        {
                            item.price
                        }
                    </div>
                </div>
            </div>
            <img className="go_share go_text"/>
        </div>
    </div>
}

function fn(){
    const [data, setData] = useState({
        list: [],
        page: 0,
        pageCount: 1
    })

    const getData = async () => {
        if(data.page === data.pageCount) return
        const res = await fetchData(data.page + 1)
        if(res.code === 0) {
            setData({
                ...res,
                list: res.page === 1 ? res.list : data.list.concat(res.list)
            })
        }
    }

    const handleScrolltolower = () => {
        getData()
    }

    useEffect(() => {
        getData()
    }, [])

    return <ScrollView 
        data = {data}
        component={Item}
        scrolltolower={handleScrolltolower}
        scroll={() => {}}/>
}

class ScrollView extends React.Component{
    handleScroll = (e) => {
        const {scroll} = this.props
        scroll && scroll(e);
        this.handleScrolltolower()
    }

    handleScrolltolower(){
        const {scrolltolower} = this.props;
        const {scrollHeight, scrollTop, offsetHeight} = this.node;
        if(scrollHeight === scrollTop + offsetHeight){
            scrolltolower && scrolltolower();
        }
    }

    node = null;

    constructor(props){
        super(props)
        this.state = {
            list: []
        }
        this.handleScrolltolower = debounce(this.handleScrolltolower, 200)
    }

    static getDerivedStateFromProps(newProps){
        const {data} = newProps;
        return {
            list: data.list || []
        }
    }

    shouldComponentUpdate(newProps, newState){
        return newState.list !== this.state.list;
    }

    getSnapshotBeforeUpdate(){
        return this.node.scrollHeight;
    }

    componentDidUpdate(prevProps, prevState, snapshot){

    }

    componentDidMount(){
        this.node.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount(){
        this.node.removeEventListener('scroll', this.handleScroll)
    }

    render(){
        const {list} = this.state
        const {component} = this.props
        return <div className="list_box" ref = {(node) => this.node = node}>
            {
                list.map((item) => (
                    React.createElement(component, {
                        item,
                        key: item.id
                    })
                ))
            }
        </div>
    }
}
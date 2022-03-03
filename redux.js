const compose = (...funcs) => {
    return funcs.reduce((f, g) => (x) => f(g(x)));
}

const Store = createStore(rootReducer, initialState, middleware);

const rootReducer = combineReducers({
    number: numberReducer,
    info: InfoReducer
})

const middleware = applyMiddleware(logMiddleware);

function numberReducer(state = 1, action){
    switch(action.type){
        case 'ADD':
            return state + 1;
        case 'DEL':
            return state - 1;
        default:
            return state;
    }
}

function InfoReducer(state = {}, action){
    const {payload = {}} = action;
    switch(action.type){
        case 'SET':
            return {
                ...state,
                ...payload
            }
        default:
            return state
    }
}

function logMiddleware(){
    return (next) => {
        return (action) => {
            const {type} = action;
            return next(action)
        }
    }
}

const rootMiddleware = applyMiddleware(logMiddleware);
const rootReducer = combineReducers({
    number: numberReducer,
    info: InfoReducer
})
const Store = createStore(rootReducer, {number: 1, info: {name: null}}, rootMiddleware);

function Index(){
    const [state, changeState] = useState(Store.getState());
    useEffect(() => {
        const unSubscribe = Store.subscribe(() => {
            changeState(Store.getState())
        })

        return () => unSubscribe()
    }, [])

    return <div>
        <span>{ state.info.name ? `hello ${state.info.name}` : 'name'}</span>
        <span>{ state.info.mes ? state.info.mes : 'mes'}</span>
        <span>{state.number}</span>
        <button onClick={() => {Store.dispatch({type: 'ADD'})}}>add</button>
        <button onClick={() => {Store.dispatch({type: 'SET', payload: {name: 'alien', mes: 'let'}})}}></button>
    </div>
}

export default function Root(){
    return <Provider store={Store}>
        <Index/>
    </Provider>
}

function connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
const mapStateToProps = state => ({
    number: state.number
})
const mapDispatchToProps = dispatch => {
    return {
        numberAdd: () => dispatch({type: 'ADD'}),
        setInfo: () => dispatch({type: 'SET'})
    }
}

export default function Root(){
    React.useEffect(() => {
        Store.dispatch({type: 'Add'})
        Store.dispatch({type: 'Set', payload: {name: 'alien', mes: 'let'}})
    }, [])

    return <Provider store={Store}>
        <Index/>
    </Provider>
}

import hoistNonReactStatics from 'hoist-non-react-statics';
import React, { useEffect } from 'react';
import {connect} from 'react-redux';
class Index extends React.Component{
    componentDidMount(){}

    render(){
        const {info, number} = this.props;
        return <div>
            <span>{info.name}{info.mes}{number}</span>
        </div>
    }
}

const mapStateToProps = state => ({name: state.name, info: state.info})
export default connect(mapStateToProps)(Index);



function ComA({toComB, comBSay}){
    const [ComASay, setComASay] = useState("");
    return <div className='box'>
        <span>{comBSay}</span>
        <input placeholder='ComASay' onChange={(e) => setComASay(e.target.value)}/>
        <button onClick={() => toComB(ComASay)}></button>
    </div>
}

const ComAMapStateToProps = state => ({comBSay: state.info.comBSay});
const ComAMapDispatchToProps = dispatch => ({toComB: (mes) => dispatch({type: 'SET', payload: {ComASay: mes}})})
export const CompA = connect(ComAMapStateToProps, ComAMapDispatchToProps)(ComA);

class ComponentB extends React.Component{
    state = {compBSay: ""}
    handleToA = () => {
        this.props.dispatch({type: 'SET', payload: {
            compBSay: this.state.compBSay
        }})
    }

    render(){
        return <div className='box'>
            <span>{this.props.compASay}</span>
            <input placeholder='CompBsay' onChange={(e) => this.setState({
                compBsay: e.target.value
            })}></input>
            <button onClick={this.handleToA}></button>
        </div>
    }
}

const CompBMapStateToProps = state => ({
    compAsay: state.info.compAsay
})
export const CompB = connect(CompBMapStateToProps)(ComponentB);


const ReactReduxContext = React.createContext(null);
function Provider({store, context, children}){
    const contextValue = useMemo(() => {
        const subscription = new Subscription(store);
        return {
            store,
            subscription
        }
    }, [store]);

    useEffect(() => {
        const {subscription} = contextValue;
        subscription.trySubscribe();

        return () => {
            subscription.tryUnsubscribe();
        }
    }, [contextValue]);

    const Context = ReactReduxContext;
    return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default class Subscription{
    constructor(store, parantSub){}

    addNestedSub(listener){
        this.trySubscribe();
        return this.listeners.subscribe(listener);
    }

    notifyNestedSubs(){
        this.listeners.notify();
    }

    trySubscribe(){
        if(!this.unSubscribe){
            this.unSubscribe = this.parantSub 
                ? this.parantSub.addNestedSub(this.handleChangeWrapper)
                : this.store.subscribe(this.handleChangeWrapper);
            this.listeners = createListenerCollection();
        }
    }

    tryUnsubscribe(){}
}

function connect(mapStateToProps, mapDispatchToProps){
    const Context = ReactReduxContext;
    return function wrapWithConnect(WrappedComponent){
        function createChildSelector(store){
            return selectorFactory(store.dispatch, {
                mapStateToProps,
                mapDispatchToProps
            })
        }

        function ConnectFunction(props){
            const contextValue = useContext(ContextToUse);
            const childPropsSelector = createChildSelector(contextValue.store);
            const [subscription, notifyNestedSubs] = useMemo(() => {
                const subscription = new Subscription(
                    store,
                    didStoreComeFromProps ? null : contextValue.subscription
                )
                return [
                    subscription,
                    subscription.notifyNestedSubs
                ]
            }, [store, didStoreComeFromProps, contextValue])

            const actualChildProps = childPropsSelector(store.getState(), wrapperProps);
            const lastChildProps = useRef();

            const [forceUpdate] = useState(0);
            useEffect(() => {
                const checkForUpdates = () => {
                    newChildProps = childPropsSelector();
                    if(newChildProps === lastChildProps.current){
                        notifyNestedSubs()
                    } else {
                        forceUpdate(state => state + 1);
                        lastChildProps.current = newChildProps;
                    }
                }

                subscription.onStateChange = checkForUpdates
                subscription.trySubscribe();
                checkForUpdates();
            }, [store, subscription, childPropsSelector])

            return <ContextToUse.Provider value={{ ...contextValue, subscription }}>
                <WrappedComponent {...actualChildProps}/>
            </ContextToUse.Provider>
        }

        const Connect = React.memo(ConnectFunction);
        return hoistStatics(Connect, WrappedComponent)
    }
}
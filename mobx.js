class Root{
    constructor(){
        makeObservable(this)
    }
    @observable name = 'alien';
    @action setName(name){this.name=name}

    @observable object = {
        age: 12,
        mes: 5
    }

    @computed get total(){
        return this.price * this.count;
    }

    @action setMes(mes){this.object.mes = mes}
    @action setObject(object){this.object = object}
}

<Provider Root={Root}></Provider>

@inject("Root")
class Index extends React.Component{}

@observer 
class Test extends React.Component{}



import {observable, action, makeObservable} from "mobx";
import React, { Component } from "react";
class Root{
    constructor(){
        makeObservable(this);
    }

    @observabel info = {
        name: 'xxx',
        mes: 'xxx'
    }

    @action setInfo(info){
        this.info = info;
    }
}


export default function Index(){
    return <Provider Root={Root}>
        <Child/>
    </Provider>
}

const getUserInfo = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'alien',
                mes: 'let'
            })
        }, 1000)
    })
}

@inject("Root")
@observer
class Child extends React.Component{
    async componentDidMount() {
        const res = await getUserInfo();
        this.props.Root.setInfo(res);
    }

    render(){
        const {info} = this.props.Root;
        return <div className="box">
            <span>{info.name}</span>
            <span>{info.mes}</span>
        </div>
    }
}

class Communicate{
    constructor(){
        makeObservable(this)
    }

    @observable mesA = ""
    @observable mesB = ""
    @action setMesA(mes){
        this.mesA = mes
    }
    @action setMesB(mes){
        this.mesB = mes
    }
}

export default new Communicate()

@inject('Communicate')
@observer
class ComponentA extends React.Component{
    state = {
        CompAsay: ""
    }

    render(){
        const {CompAsay} = this.state;
        const {mesB} = this.props.Communicate;
        return <div className="box">
            <span>{mesB}</span>
            <input onChange={(e)> this.setState({
                CompAsay: e.target.value
            })} placeholder="CompAsay"></input>
            <button onClick={() => this.props.Communicate.setMesA(CompAsay)}></button>
        </div>
    }
}

@inject('Communicate')
@observer
class ComponentB extends React.Component{
    state = {
        compBsay: ""
    }
    render(){
        const {compBsay} = this.state;
        const {mesA} = this.props.Communicate;
        return <div className="box pt50">
            <span>{mesA}</span>
            <input onChange={(e) => this.setState({
                compBsay: e.target.value
            })} placeholder="CompBsay"></input>
            <button onClick={() => this.props.Communicate.setMesB(compBsay)}></button>
        </div>
    }
}

function createObservable(target, name, descriptor){
    if(isStringish(name)){
        target[Symbol("mobx-stored-annotations")][name] = {
            annotaionType_: 'observable',
            options_: null,
            make_,
            extend_
        }
    }
}

function make_(adm, key, descriptor){
    return this.extend_(adm, key, descriptor);
}

function extend_(adm, key, descriptor){
    return adm.defineObservableProperty_(key, descriptor, options);
}

function makeObservable(target){
    const adm = new ObservableObjectAdministration(target);
    target[Symbol("mobx administration")] = adm;
    startBatch();
    try{
        let annotations = target[Symbol("mobx-stored-annotations")];
        Reflect.ownKeys(annotations).forEach(key => adm.make_(key, annotations[key]))
    }finally{
        endBatch()
    }
}

class ObservableObjectAdministration{
    constructor(target_, values_){
        this.target_ = target_;
        this.values_ = new Map()
    }

    getObservablePropValue_(key){
        return this.values_.get(key).get()
    }

    setObservablePropValue_(key, newValue){
        const observable = this.values_.get(key);
        observable.setNewValue_(newValue);
    }

    make_(key, annotation){
        const outcome = annotation.make_(this, key, descriptor, source);
    }

    defineObservableProperty_(key, value){
        try{
            startBatch()
            const descriptor = {
                get() {
                    this.getObservablePropValue_(key)
                },
                set(value){
                    this.setObservablePropValue_(key, value)
                }
            }

            Object.defineProperty(this.target_, key, descriptor);
            const observable = new ObservableValue_(value);
            this.values_.set(key, observable);
        } finally{
            endBatch()
        }
    }
}

class Atom{
    observers_ = new Set();
    reportChanged(){
        startBatch()
        propagateChanged(this);
        endBatch()
    }
    reportObserved(){
        return reportObserved(this)
    }
}

class ObservableValue extends Atom{
    get(){
        this.reportObserved();
        return this.dehanceValue(this.value_)
    }
    setNewValue_(newValue){
        const oldValue = this.value_;
        this.value_=newValue;
        this.reportChanged()
    }
}

const MobxProviderContext = React.createContext({})
export function Provider(props){
    return <MobxProviderContext.Provider value={value}>
        {children}
    </MobxProviderContext.Provider>
}

function inject(...storeNames){
    const Injector = React.forwardRef((props, ref) => {
        let newProps = {...props};
        const context = React.useContext(MobxProviderContext);
        storeNames.forEach(function(storeName){
            if(storeName in newProps) return
            if(!(storeName in context)){
                newProps[storeName] = context[storeName]
            }
        })

        return React.createElement(component, newProps);
    })

    return Injector;
}

function observer(componentClass){
    return function makeClassComponentObserver(){
        const target = componentClass.prototype;
        const baseRender = target.render;
        target.render = function(){
            return makeComponentReactive.call(this, baseRender);
        }
    }
}

function makeComponentReactive(){
    const baseRender = render.bind(this);
    const reaction = new Reaction(`${initialName}.render()`, () => {
        Component.prototype.forceUpdate.call(this);
    })
    reaction["reactComponent"] = this;
    reactiveRender["$mobx"] = reaction;
    this.render = reactiveRender;

    function reactiveRender(){
        reaction.track(() => {
            try{
                rendering = baseRender()
            } catch(e){}
        })
        return rendering;
    }

    return reactiveRender.call(this);
}

class Reaction{
    constructor(name_, onInvalidate_){
        this.name = name_;
        this.onInvalidate_ = onInvalidate_;
    }

    onBecomeStale_(){
        this.schedule_()
    }

    schedule_(){
        if(!this.isScheduled){
            this.isScheduled = true;
            globalState.pendingReactions.push(this);
            runReactions();
        }
    }

    runReaction_(){
        startBatch();
        this.isScheduled = false;
        const prev = globalState.trackingContext;
        globalState.trackingContext = this;
        this.onInvalidate_();
        globalState.trackingContext = prev;
        endBatch()
    }

    track(fn){
        startBatch();
        const prevTracking = globalState.trackingDerivation;
        globalState.trackingDerivation = this
        const result = fn.call(context);
        globalState.trackingDerivation = prevTracking;
        bindDependencies(this)
    }
}

function reportObserved(observabel){
    const derivation = globalState.trackingDerivation;
    derivation.newObserving_[derivation.unboundDepsCount_++] = observable
}

function bindDependencies(Reaction){
    const prevObserving = derivation.observing_
    const observing = (derivation.observing_ = derivation.newObserving_)
    let l = prevObserving.length;
    while(l--){
        const observableValue = prevObserving[l];
        observable.observers_.delete(Reaction);
    }
    let i0 = observing.length;
    while(i0--){
        const observableValue = observing[i0];
        observable.observers_.add(Reaction);
    }
}
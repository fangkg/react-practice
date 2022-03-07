import React, { useCallback, useContext, useEffect } from "react";

function useXXX(){
    return [xxx]
}

const [xxx] = useXXX(a);

function useT(){
    const value = React.useContext(defaultContext);
    const newValue = initValueFunction(value);
    return newValue;
}

function useF(){
    const newValue = React.useRef(null);
    const value = React.useContext(defaultContext);
    if(!newValue.current){
        newValue.current = initValueFunction(value);
    }
    return newValue.current;
}

function useXXX(){
    const value = React.useContext(defaultContext);
    const newValue = React.useMemo(() => initValueFunction(value), [value])
    return newValue;
}

function useTest(){
    const [number] = React.useState(0);
    const value = React.useMemo(()=> {

    }, [number]);
    const callback = React.useCallback(function(){

    }, [value])
}

export default function useHistory(){
    return useContext(RouterContext).history
}

function useForm(){
    const formCurrent = React.useRef(null);
    if(!formCurrent.current){
        formCurrent.current = new FormStore()
    }
    return formCurrent.current;
}

function useRenderCount(){
    const isFirstRender = React.useRef(null);
    const renderCount = React.useRef(1);
    useEffect(() => {
        isFirstRender.current = false;
    }, [])

    useEffect(() => {
        if(!isFirstRender.current) renderCount.current++;
    })

    return [renderCount.current, isFirstRender.current]
}

export function debounce(fn, time){
    let timer = null;
    return function(...arg){
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arg);
        }, time);
    }
}

function useDebounceState(defaultValue, time){
    const [value, changeValue] = useState(defaultValue);
    const newChange = React.useMemo(() => debounce(changeValue, time), [time]);
    return [value, newChange];
}

export default function Index(){
    const [value, setValue] = useDebounceState("", 300);
    return <div style={{marginTop: '50px'}}>
        <input placeholder="" onChange={(e) => setValue(e.target.value)}></input>
    </div>
}

function useControlData(){
    
}

function useXXX(){
    const newValue = React.useRef(null);
    const value = React.useContext(defaultContext);
    if(!newValue.current){
        newValue.current = initValueFunction(value);
    }
    return newValue.current;
}

function useXXX(){
    const value = React.useContext(defaultContext);
    const newValue = React.useMemo(() => initValueFunction(value), [value]);
    return newValue;
}

function useTest(){
    const [number] = React.useState(0);
    const value = React.useMemo(() => {

    }, [number]);
    const callback = React.useCallback(() => {

    }, value);
}

export default function useHistory(){
    return useContext(RouterContext).history;
}

function useForm(){
    const formCurrent = React.useRef(null);
    if(!formCurrent.current){
        formCurrent.current = new FormStore()
    }
    return formCurrent.current;
}

function useRenderCount(){
    const isFirstRender = React.useRef(true);
    const renderCount = React.useRef(1);

    useEffect(() => {
        isFirstRender.current = false;
    }, [])

    useEffect(() => {
        if(!isFirstRender.current) renderCount.current++
    })
    return [renderCount.current, isFirstRender.current];
}


export function debounce(fn, time){
    let timer = null;
    return function(...arg){
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arg)
        }, time); 
    }
}

function useDebounceState(defaultState, time){
    const [value, changeValue] = useState(defaultState);
    const newChange = React.useMemo(() => debounce(changeValue, time), [time]);
    return [value, newChange];
}

export default function Index(){
    const [value, setValue] = useDebounceState('', 300);
    return <div style={{marginTop: '50px'}}>
            <input placeholder="" onChange={(e) => setValue(e.target.value)}></input>
        </div>
}


function useControlData(){
    const [isLoading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);
    const getData = (data) => {
        setLoading(false);
        setData(data);
    }
    const resetData = () => {
        setLoading(true);
        setData([]);
    }
    return [getData, resetData]
}

function useAsyncState(defaultValue){
    const value = React.useRef(defaultValue);
    const [, forceUpdate] = React.useState(null);
    const dispatch = (fn) => {
        let newValue
        if(typeof fn === 'function'){
            newValue = fn(value.current);
        } else {
            newValue = fn
        }
        value.current = newValue
        forceUpdate({})
    }
    return [value, dispatch]
}

export default function Index(){
    const [data, setData] = useAsyncState(0);
    return <div style={{marginTop: '50px'}}>
            <button onClick={() => {
                setData(num => num + 1)
            }}></button>
        </div>
}

function useGetDOM(){
    const dom = React.useRef();
    React.useEffect(() => {

    }, [])
    return dom;
}

export default function Index(){
    const dom = useGetDOM();
    return <div ref={dom}>
            <button></button>
        </div>
}

function useEffectProps(value, cb){
    const isMounted = React.useRef(false);
    React.useEffect(() => {
        isMounted.current && cb && cb();
    }, [value])
    React.useEffect(() => {
        isMounted.current = true
    }, [])
}

function Index(props){
    useEffectProps(props.a, () => {

    })
    return <div>子组件</div>
}

export default function Home(){
    const [a, setA] = React.useState(0);
    const [b, setB] = React.useState(0);
    return <div>
        <Index a={a} b={b}/>
        <button onClick={() => setA(a+1)}></button>
        <button onClick={() => setB(b+1)}></button>
    </div>
}

export const LogContext = React.createContext({});
export default function useLog(){
    const message = React.useContext(LogContext);
    const listenDOM = React.useRef(null);
    const reportMessage = React.useCallback(function(data, type) {
        if(type === 'pv'){

        } else if(type === 'click'){

        }
    }, [message])

    React.useEffect(() => {
        const handleClick = function(){
            reportMessage(e.target, 'click')
        }
        if(listenDOM.current){
            listenDOM.current.addEventListener('click', handleClick);
        }

        return function(){
            listenDOM.current && listenDOM.current.removeListener('click', handleClick)
        }
    }, [reportMessage]);

    return [listenDOM, reportMessage];
}

function Home(){
    const [dom, reportMessage] = useLog();
    return <div>
        <div ref={dom}>
           <button>click</button> 
        </div>
        <button onClick={() => reportMessage}></button>
    </div>
}

const Index = React.memo(Home);
export default function Root(){
    const [value, setValue] = useState([]);
    return <LogContext.Provider value={value}>
            <Index/>
            <button onClick={() => setValue({
                name: 'name',
                author: 'author'
            })}></button>
        </LogContext.Provider>
}

function useQueryTable(defaultQuery = {}, api){
    const formData = React.useRef({});
    const pagination = React.useRef({
        page: defaultQuery.page || 1,
        pageSize: defaultQuery.pageSize || 10
    })

    const [, forceUpdate] = React.useState(null);

    const [tableData, setTableData] = React.useState({
        data: [],
        total: 0,
        current: 1
    })

    const getList = React.useCallback(async function(payload = {}){
        if(!api) return
        const data = await api({
            ...defaultQuery,
            ...payload,
            ...pagination.current,
            ...formData.current
        }) || {}

        if(data.code == 200){
            setTableData({
                list: data.list,
                current: data.current,
                total: data.total
            })
        } else {}
    }, [api])

    const setFormItem = React.useCallback(function(key, value) {
        const form = formData.current;
        form[key] = value;
        forceUpdate();
    }, [])

    const reset = React.useCallback(function(){
        const current = formData.current;
        for(let name in current){
            current[name] = ""
        }
        pagination.current.page = defaultQuery.page || 1
        pagination.current.pageSize = defaultQuery.pageSize || 10
        getList()
    }, [getList])

    const handleChange = React.useCallback(async function(page, pageSize){
        pagination.current = {
            page,
            pageSize
        }
        getList()
    }, [getList])

    React.useEffect(() => {
        getList()
    }, [])

    return [
        {
            tableData,
            handleChange,
            getList,
            pagination: pagination.current
        },
        {
            formData: formData.current,
            setFormItem,
            reset
        }
    ]
}

function getTableData(payload){
    return new Promise((resolve) => {
        Promise.resolve().then(() => {
            const {list} = listData;
            const arr = threeNumberRandom();
            resolve({
                ...listData,
                list: [list[arr[0]], list[arr[1]], list[arr[2]]],
                total: list.length,
                current: payload.page || 1
            })
        })
    })
}

function Index(){
    const [table, form] = useQueryTable({
        pageSize: 3
    }, getTableData);
    const {formData, setFormItem, reset} = form;
    const {pagination, tableData, getList, handleChange} = table;
    return <div style={{margin: '30px'}}>
        <div style={{marginBottom: '24px'}}>
            <Input onChange={(e) => setFormItem('name', e.target.value)}
                placeholder="placeholder"
                style={inputStyle}
                value={formData.name || ""}/>
            <Select onChange={(value) => setFormItem('type', value)}
                placeholder="placeholder"
                style={inputStyle}
                value={formData.type}>
                  <Option value="1">家电</Option>  
            </Select>
            <button className="searchbtn" onClick={() => getList()}>submit</button>
            <button className="searchbth" onClick={reset}>reset</button>
        </div>
        {
            useCallback(<Table columns={columns}
                dataSource={tableData.list}
                height="300px"
                onChange={(res) => {
                    handleChange(res.current, res.pageSize)
                }}
                pagination={{...pagination, tatal: tableData.total, current: tableData.current}}/>, [tableData])
        }
    </div>
}

const store = useCreateStore(reducer, initState);
const Store = ReduxHooksStore(reducer, initState).exportStore();
const mapStoreToState = (state) => ({
    number: state.number
})
const [state, dispatch] = useConnect(mapStoreToState);

export const ReduxContext = React.createContext(null);
export function useCreateStore(reducer, initState){
    const store = React.useRef(null);
    if(!store.current){
        store.current = new ReduxHooksStore(reducer, initState).exportStore()
    }
    return store.current;
}


import {unstable_batchedUpdates} from "react-dom";
class ReduxHooksStore{
    constructor(reducer, initState){
        this.name = "__ReduxHooksStore__"
        this.id = 0
        this.reducer = reducer
        this.state = initState
        this.mapConnects = {}
    }

    exportStore = () => {
        return {
            dispatch: this.dispatch.bind(this),
            subscribe: this.subscribe.bind(this),
            unSubscribe: this.unSubscribe.bind(this),
            getInitState: this.getInitState.bind(this)
        }
    }

    getInitState = (mapStoreToState) => {
        return mapStoreToState(this.state);
    }

    publicRender = () => {
        unstable_batchedUpdates(() => {
            Object.keys(this.mapConnects).forEach(name => {
                const {update} = this.mapConnects[name];
                update(this.state);
            })
        })
    }

    dispatch = (action) => {
        this.state = this.reducer(this.state, action);
        this.publicRender()
    }

    subscribe = (connectCurrent) => {
        const connectName = this.name + (++this.id);
        this.mapConnects[connectName] = connectCurrent;
        return connectName;
    }

    unSubscribe = (connectName) => {
        delete this.mapConnects[connectName];
    }
}

export function useConnect(mapStoreToState = {}){
    const contextValue = React.useContext(ReduxContext);
    const {getInitState, subscribe, unSubscribe, dispatch} = contextValue;
    const stateValue = React.useRef(getInitState(mapStoreToState));
    const [, forceUpdate] = React.useState();
    const connectValue = React.useMemo(() => {
        const state = {
            cacheState: stateValue.current,
            update: function(newState){
                const selectState = mapStoreToState(newState)
                const isEqual = shallowEqual(state.cacheState, selectState);
                state.cacheState = selectState;
                stateValue.current = selectState;
                if(!isEqual){
                    forceUpdate()
                }
            }
        }

        return state;
    }, [contextValue])

    React.useEffect(() => {
        const name = subscribe(connectValue);
        return function(){
            unSubscribe(name)
        }
    }, [connectValue])

    return [stateValue.current, dispatch]
}

function Index(){
    const [isShow, setShow] = React.useState(true);
    return <div>
        <CompA/>
        <CompB/>
        <CompC/>
        { isShow && <CompD/>}
        <button onClick={() => setShow(!isShow)}>click</button>
    </div>
}

function Root(){
    const store = useCreateStore(function(state, action) {
        const {type, payload} = action;
        if(type === 'setA'){
            return {
                ...state,
                mesA: payload
            }
        } else if(type === 'setB'){
            return {
                ...state,
                mesB: payload
            }
        } else if(type === 'clear'){
            return {
                mesA: '',
                mesB: ''
            }
        } else {
            return state
        }
    },
    {mesA: '11', mesB: '22'})

    return <div>
        <ReduxContext.Provider value={store}>
            <Index/>
        </ReduxContext.Provider>
    </div>
}

function CompA(){
    const [value, setValue] = useState("");
    const [state, dispatch] = useConnect((state) => ({
        mesB: state.mesB
    }))
    return <div className="component_box">
       <span>{state.mesB}</span> 
       <input onChange={(e) => setValue(e.target.value)} placeholder="placeholder"/>
       <button onClick={() => dispath({
           type: 'setA',
           payload: value
       })}></button>
    </div>
}
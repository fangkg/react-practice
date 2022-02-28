function UserInfo(){
    const user = getUserInfo();
    return <div>{user.name}</div>
}

export default function Index(){
    return <Suspense fallback={<h1>loading...</h1>}>
        <UserInfo/>
    </Suspense>
}

const LazyComponent = React.lazy(() => import(''))

function lazy(ctor){
    return {
        $$typeof: REACT_LAZY_TYPE,
        _payload: {
            _status: -1,
            _result: ctor
        },
        _init: function(payload){
            if(payload._status === -1){
                const ctor = payload._result;
                const thenable = ctor();
                payload._status = Pending;
                payload._result = thenable;
                thenable.then((moduleObject) => {
                    const defaultExport = moduleObject.default;
                    resolved._status = Resolved;
                    resolved._result = defaultExport;
                })
            }
            if(payload._status === Resolved){
                return payload._result;
            } else {
                throw payload._result;
            }
        }
    }
}

class Index extends React.Component{
    state = {
        hasError: false
    }

    componentDidCatch(...arg){
        uploadErrorLog(arg);
        this.setState({
            hasError: true
        })
    }

    static getDerivedStateFromError(){
        return {
            hasError: true
        }
    }

    render(){
        const {hasError} = this.state;
        return <div>
            {
                hasError ? <div>error</div> : null
            }
        </div>
    }
}


function AsyncComponent(Component, api){
    const AsyncComponentPromise = () => new Promise(async (resolve) => {
        const data = await api();
        resolve({
            default: (props) => <Component rdata={data} {...props}/>
        })
    })

    return React.lazy(AsyncComponentPromise)
}

const getData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'alien',
                say: 'let'
            })
        }, 1000)
    })
}

function Test({rdata, age}){
    const {name, say} = rdata;
    return <div>
        {name} {age} {say}
    </div>
}

export default class Index extends React.Component{
    LazyText = AsyncComponent(Test, getData);
    render(){
        const {LazyText} = this;
        return <div>
            <Suspense fallback={<div>loading</div>}>
                <LazyText age={15}/>
            </Suspense>
        </div>
    }
}
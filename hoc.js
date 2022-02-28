import React, { useEffect } from "react"

function HOC(WrapComponent){
    return class Advance extends React.Component{
        state = {
            name: 'alien'
        }
        render(){
            <WrapComponent {...this.props} {...this.state}/>
        }
    }
}

class Index extends React.Component{
    render(){
        return <div>hello</div>
    }
}

function HOC(Component){
    return class wrapComponent extends Component{

    }
}

export default HOC(Index);


function withRouter(Component){
    const displayName = `withRouter(${Component.displayName} || Component.name)`;
    const Com = props => {
        const {wrappedComponentRef, ...remainingProps} = props;
        return (
            <RouterContext.Consumer>
                {
                    context => {
                        return (
                            <Component {...remainingProps}
                                {...context}
                                ref={wrappedComponentRef}/>
                        )
                    }
                }
            </RouterContext.Consumer>
        )
    }

    Com.displayName = displayName;
    Com.WrapComponent = Component;
    return hoistStatics(Com, Component);
}
export default withRouter;

const HOC = (WrapComponent) => class Index extends WrapComponent {
    render(){
        if(this.props.visible) {
            return super.render()
        } else {
            return <div>暂无数据</div>
        }
    }
}

class Index extends React.Component{
    render(){
        return <div>
            <ul>
                <li>react</li>
            </ul>
        </div>
    }
}

function HOC(Component){
    return class Advance extends Component{
        render(){
            const element = super.render()
            const otherProps = {
                name: 'alien'
            }
            const appendElement = React.createElement('li', {}, `hello ${otherProps.name}`)
            const newChild = React.Children.map(element.props.Children.props.Children, (child, index) => {
                if(index === 2) return appendElement
                return child
            })
            return React.cloneElement(element, element.props, newChild)
        }
    }
}


export default function dynamicHoc(loadRouter){
    return class Content extends React.Component{
        state = {
            Component: null
        }
        componentDidMount(){
            if(this.state.Component) return
            loadRouter().then(module => module.default).then(Component => this.setState({Component}))
        }
        render(){
            const {Component} = this.state
            return Component ? <Component {...this.props}/> : <Loading/>
        }
    }
}

function HOC(Component){
    return class WrapComponent extends React.Component{
        constructor(){
            super()
            this.node = null
        }
        render(){
            return <Component {...this.props} ref={(node) => this.node = node}/>
        }
    }
}

function ClickHOC(Component){
    return function Wrap(props){
        const dom = React.useRef(null);
        useEffect(()=> {
            const handleClick = () => console.log('click')
            dom.current.addEventListener('click', handleClick)
            return () => dom.current.removeEventListener('click', handleClick)
        }, [])
        return <div ref={dom}>
            <Component {...props}/>
        </div>
    }
}

@ClickHOC
class Index extends React.Component{
    render(){
        return <div className="index">
            <button>点击</button>
        </div>
    }
}

export default () => {
    return <div className="box">
        <Index></Index>
        <button>外部点击</button>
    </div>
}

const Permissin = React.createContext([])
function Index(){
    const [rootPermission, setRootPermission] = React.useState([])
    React.useEffect(() => {
        getRootPermission().then(res => {
            const {code, data} = res 
            code === 200 && setRootPermission(data)
        })
    }, [])

    return <Permission.Provider value={rootPermission}>
        <RootRouter/>
    </Permission.Provider>
}

function NoPermission(){
    return <div>no permission</div>
}

export function PermissionHOC(authorization){
    return function(Component){
        return function Home(props){
            const matchPermission = (value, list) => list.indexOf(value);
            return <Permissin.Consumer>
                {
                    (permissionList) => matchPermission(authorization, permissionList) >= 0 
                        ? <Component {...props}/>
                        : <NoPermission/>
                }
            </Permissin.Consumer>
        }
    }
}
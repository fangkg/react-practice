import React, {useCallback, useState, useEffect, createContext, useMemo} from "react";
import {createBrowserHistory as createHistory} from 'history';

export const RouterContext = createContext();
export let rootHistory = null;

export default function Router(props){
    const history = useMemo(() => {
        rootHistory = createHistory();
        return rootHistory;
    }, [])

    const [location, setLocation] = useState(history.location);

    useEffect(() => {
        const unlisten = history.listen((location) => {
            setLocation(location);
        })
        return function(){
            unlisten && unlisten();
        }
    }, [])

    return <RouterContext.Provider
        value={{
            location,
            history,
            match: {
                path: '/',
                url: '/',
                params: {},
                isExact: location.pathname === '/'
            }
        }}>
            {props.children}
        </RouterContext.Provider>
}

import React, {useContext} from "react";
import {matchPath} from "react-router";
function Route(props){
    const context = useContext(RouterContext);
    const location = props.location || context.location;
    const match = props.computedMath ? 
        props.computedMath : 
            props.path ? 
                matchPath(location.pathname, props) : 
                context.match;

    const newRouterProps = {...context, location, match};
    let {children, component, render} = props;
    if(Array.isArray(children) && children.length ===  0) children = null;
    let renderChildren = null;
    if(newRouterProps.match){
        if(children){
            renderChildren = typeof children === 'function' ? children(newRouterProps) : children;
        } else if(component){
            renderChildren = React.createElement(component, newRouterProps);
        } else if(render){
            renderChildren = render(newRouterProps);
        }
    }

    return <RouterContext.Provider value={newRouterProps}>
        {
            renderChildren
        }
    </RouterContext.Provider>
}


export default function Switch(props){
    const context = useContext(RouterContext);
    const location = props.location || context.location;
    let children, match
    React.Children.forEach(props.children, child => {
        if(!match && React.isValidElement(child)){
            const path = child.props.path;
            children = child;
            match = path ? matchPath(location.pathname, {...child.props}) : context.match;
        }
    })

    return match ? React.cloneElement(children, {location, computedMath: match}) : null;
}

export function useHistory(){
    return useContext(RouterContext).history;
}

export default function useLocation(){
    return useContext(RouterContext).location;
}

function useListen(cb){
    useEffect(() => {
        if(!rootHistory) return () => {}
        const unlisten = rootHistory.listen((location) => {
            cb && cb(location);
        })
        return function(){
            unlisten && unlisten()
        }
    }, [])
}

import hoistStatics from 'hoist-non-react-statics';
export default function withRouter(Component){
    const WrapComponent = (props) => {
        const {wrapComponentRef, ...remainingProps} = props;
        const context = useContext(RouterContext);
        return <Component {...remainingProps}
            ref={wrapComponentRef}
            {...context}/>
    }
    return hoistStatics(WrapComponent, Component);
}

import Router, {RouterContext} from "./components/Router";
import Route from './component/Route';
import Switch from "./component/Switch";
import useHistory from "./hooks/useHistory";
import useListen from "./hooks/useListen";
import useLocation from "./hooks/useLocation";
import withRouter from "./hoc/withRouter";

export {
    Router,
    Switch,
    Route,
    RouterContext,
    useHistory,
    useListen,
    useLocation,
    withRouter
}


import React from 'react';
import {Router, Route, useHistory, useListen, Switch} from './router';
import Detail from './pages/detail';
import Home from "./pages/home";
import List from "./pages/list";
import "./index.scss";

const menusList = [
    {
        name: '首页',
        path: '/home'
    },
    {
        name: '列表',
        path: '/list'
    },
    {
        name: '详情',
        path: '/detail'
    }
]

function Nav(){
    const history = useHistory();
    const RouterGo = (url) => history.push(url);
    const path = history.location.pathname;
    return <div>
        {
            menusList.map((item) => <span 
                className={`nav ${item.path === path} ? 'active' : ''`} 
                key={item.path}
                onClick={() => RouterGo(item.path)}>
                    {item.name}
                </span>)
        }
    </div>
}

function Top(){
    useListen((location) => {
        
    })

    return <div>
        typeof
    </div>
}

function Index(){
    return <Router>
        <Top/>
        <Nav/>
        <Switch>
            <Route component={Home} path="/home"></Route>
            <Route component={Detail} path="/detail"></Route>
            <Route path="/list" render={(props) => <List {...props}/>}></Route>
        </Switch>
    </Router>
}


export default function Home(){
    return <div>
        HOME
    </div>
}

@withRouter
class HomeOne extends React.Component{
    RouteGo = () => {
        const {history} = this.props;
        history.push("/detail")
    }

    render(){
        return <div>
            withRouter
            <button onClick={this.RouteGo}></button>
        </div>
    }
}

export default function List(){
    return <div>
        <li>React</li>
    </div>
}

export default function Index(){
    return <div>
        DETAIL
    </div>
}
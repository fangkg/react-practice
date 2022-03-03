// history popstate onhashchange push replace
// react-router Router Route Switch Redirect
// react-router-dom NavLink Link BrowserRouter HashRouter

import {BrowserRouter as Router } from 'react-router-dom';
import {HashRouter as Router} from "react-router-dom";

function Index(){
    return <Router>

    </Router>
}

import { createBrowserHistory as createHistory } from 'history';
import React from 'react';
import { Switch, __RouterContext } from 'react-router';
class BrowserRouter extends React.Component{
    history = createHistory(this.props);
    render(){
        return <Router history={this.history} children={this.props.children}/>
    }
}

window.history.pushState(state, title, path);

window.history.replaceState(state, title, path);

window.addEventListener('popstate', function(e){})

window.location.hash

window.addEventListener('hashchange', function(e){})

class Router extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            location: props.history.location
        };
        this.unlisten = props.history.listen((location) => {
            this.setState({location})
        })
    }

    componentWillUnmount(){
        if(this.unlisten) this.unlisten()
    }

    render(){
        return <RouterContext.Provider
            children={this.props.children || null}
            value={{
                history: this.props.history,
                location: this.state.location,
                match: Router.computeRootMatch(this.state.location.pathname),
                staticContext: this.props.staticContext
            }}/>
    }
}


function Index(){
    const mes = {
        name: 'alien',
        say: 'let'
    }

    return <div>
        <Menus/>
        <Switch>
            <Route path="router/component" exact component={RouteComponent}/>
            <Route path="router/render" render={(props) => <RouterRender {...props}/>}/>
            <Route path="/router/children">
                <RouterChildren {...mes}/>
            </Route>
            <Route path="/router/renderProps">
                {
                    (props) => <RouteRenderProps {...props} {...mes}/>
                }
            </Route>
            <Redirect from={'/router/*'} to={'/router/home'}/>
        </Switch>
    </div>
}


import {withRouter} from "react-router-dom";

@withRouter
class Home extends React.Component{
    render(){
        return <div>
            <Children {...this.props}/>
        </div>
    }
}

import {useHistory, useLocation} from "react-router-dom";
function Home(){
    const history = useHistory();
    const location = useLocation();
}

const name = "alien";
const mes = "let";
history.pushState(`/home?name=${name}&mes=${mes}`)
history.push({
    pathname: '/home',
    state: {
        name,
        mes
    }
})

const {state = {}} = this.prop.location;
const {name, mes} = state;

<Route path="post/:id"/>
history.push('/post' + id);

function Home(){
    return <div>
        <Route path="/home/test" component={Test}></Route>
    </div>
}

function Index(){
    return <Switch>
        <Route path="/home" component={Home}></Route>
    </Switch>
}

function CustomRouter(props){
    const permissionList = useContext(permissionContext);
    const hasPermission = matchPermission(permissionList, props.path);
    return hasPermission ? <Route {...props}/> : <Redirect to="/noPermission"/>
}

<CustomRouter path="/list" component={List}/>

function getRootPermission(){
    return new Promise((resolve) => {
        resolve({
            code: 200,
            data: ['/config/index', '/config/writeTag']
        })
    })
}

const Permission = React.createContext([]);
export default function Index(){
    const [rootPermission, setRootPermission] = React.useState([]);
    React.useEffect(() => {
        getRootPermission().then(res => {
            const {code, data} = res;
            code === 200 && setRootPermission(data);
        })
    }, [])

    return <Permission.Provider value={rootPermission}>
        <RootRouter/>
    </Permission.Provider>
}

export function PermmisionRouter(props){
    const permissionList = useContext(Permission);
    const isMatch = permissionList.indexOf(props.path) >= 0;
    return isMatch ? <Route {...props}/> : <Redirect to={'/config/NoPermission'}/>
}
import propsTypes from 'propTypes';
class ProviderDemo extends React.Component{
    // 传递
    getChildContext(){
        const theme = {
            color: '#ccc',
            background: 'pink'
        }
        return {
            theme
        }
    }

    render(){
        return <div>hello</div>
    }
}

// 声明要传递的theme是对象结构
ProviderDemo.childContextTypes = {
    theme: propsTypes.object
}

class ConsumerDemo extends React.Component{
    render(){
        const {color, background} = this.context.theme;
        return <div style={{color, background}}>consumer</div>
    }
}

ConsumerDemo.contextTypes = {
    theme: propsTypes.object
}

const Son = () => <Consumer/>

const ThemeContext = React.createContext(null);
const ThemeProvider = ThemeContext.Provider;
const ThemeConsumer = ThemeContext.Consumer;

export default function ProviderDemo(){
    const [contextValue, setContextValue] = React.useState({
        color: '#ccc',
        background: 'pink'
    })

    return <div>
        <ThemeProvider value={contextValue}>
            <Son/>
        </ThemeProvider>
    </div>
}

class Consumer extends React.Component{
    render(){
        const {color, background} = this.context;
        return <div style={{color, background}}>consumer</div>
    }
}
Consumer.contextType = ThemeContext;
const Son = () => <Consumer/>


function ConsumerFn(){
    const contextValue = React.useContext(ThemeContext);
    const {color, background} = contextValue;
    return <div style={{color, background}}>consumer</div>
}

const Son = () => <ConsumerFn/>

const ThemeConsumer = ThemeContext.Consumer;
function Consumer(props){
    const {props, background} = props;
    return <div style={{color, background}}>consumer</div>
}

const Son = () => (
    <ThemeConsumer>
        {
            (contextValue) => <Consumer {...contextValue}/>
        }
    </ThemeConsumer>
)

function ConsumerDemo(){
    const {color, background} = React.useContext(ThemeContext);
    return <div style={{color, background}}>consumer</div>
}
const Son = React.memo(() => <ConsumerDemo/>)
const ThemeProvider = ThemeContext.Provider;
export default function ProviderDemo(){
    const [contextValue, setContextValue] = React.useState({
        color: '#ccc',
        background: 'pink'
    })

    return <div>
        <ThemeProvider value={contextValue}>
            <Son/>
        </ThemeProvider>
        <button onClick={() => setContextValue({
            color: '#fff',
            background: 'blue'
        })}></button>
    </div>
}


const ThemeContext = React.createContext(null)
const LanContext = React.createContext(null)

function ConsumerDemo(){
    return <ThemeContext.Consumer>
        {
            (themeContextValue) => (
                <LanContext.Consumer>
                    {
                        (LanContextValue) => {
                            const {color, background} = themeContextValue
                            return <div style={{color, background}}>
                                {
                                    LanContextValue === 'CH' ? '大家好' : 'hello'
                                }
                            </div>
                        }
                    }
                </LanContext.Consumer>
            )
        }
    </ThemeContext.Consumer>
}

const Son = React.memo(() => <ConsumerDemo/>)
export default function ProviderDemo(){
    const [themeContextValue] = React.useState({
        color: '#fff',
        background: 'blue'
    })
    const [LanContextValue] = React.useState('CH')
    return <ThemeContext.Provider value={themeContextValue}>
        <LanContext.Provider value={LanContextValue}>
            <Son/>
        </LanContext.Provider>
    </ThemeContext.Provider>
}


const ThemeContext = React.createContext(null)
function Son2(){
    return <ThemeContext.Consumer>
        {
            (themeContextValue2) => {
                const {color, background} = themeContextValue2
                return <div className="sonbox" style={{color, background}}>第二层provider</div>
            }
        }
    </ThemeContext.Consumer>
}

function Son(){
    const {color, background} = React.useContext(ThemeContext);
    const [themeContextValue2] = React.useState({
        color: '#fff',
        background: 'blue'
    })
    return <div className="box" style={{color, background}}>
        第一层provider
        <ThemeContext.Provider value={themeContextValue2}>
            <Son2/>
        </ThemeContext.Provider>
    </div>
}

export default function Provider1Demo(){
    const [themeContextValue] = React.useState({
        color: 'orange',
        background: 'pink'
    })
    return <ThemeContext.Provider value={themeContextValue}>
        <Son/>
    </ThemeContext.Provider>
}


const ThemeContext = React.createContext(null);
const theme = {
    dark: {
        color: '#1890ff',
        background: '#1890ff',
        border: '1px solid blue',
        type: 'dark'
    },
    light: {
        color: '#1890ff',
        background: '#1890ff',
        border: '1px solid pink',
        type: 'light'
    }
}

function Input(props){
    const {color, border} = useContext(ThemeContext);
    const {label, placeholder} = props;
    return <div>
        <label style={{color}}>{label}</label>
        <input className="input" placeholder={placeholder} style={{border}}></input>
    </div>
}

function Box(props){
    return <ThemeContext.Consumer>
        {
            (themeContextValue) => {
                const {border, color} = themeContextValue;
                return <div className="context_box" style={{border, color}}>
                    {props.children}
                </div>
            }
        }
    </ThemeContext.Consumer>
}

function Checkbox(props){
    const {label, name, onChange} = props;
    const {type, color} = React.useContext(ThemeContext);
    return <div className="Checkbox" onClick={onChange}>
        <label htmlFor="name">{lable}</label>
        <input type="Checkbox" id={name} value={type} name={name} checked={type === name} style={{color}}></input>
    </div>
}

class App extends React.PureComponent{
    static contextType = ThemeContext;
    render(){
        const {border, setTheme, color, background} = this.context;
        return <div className="contex_app" style={{border, color}}>
            <div className="context_change_theme">
                <span>主题：</span>
                <Checkbox label="light" name="light" onChange={() => setTheme(theme.light)}/>
                <Checkbox label="dark" name="dark" onChange={() => setTheme(theme.dark)}/>
            </div>
            <div className="box_content">
                <Box>
                    <Input label="姓名" placeholder="请输入姓名"></Input>
                    <Input label="年龄" placeholder="请输入年龄"></Input>
                    <button className="searchbtn" style={{background}}>确定</button>
                    <button className="cancelbtn" style={{color}}>取消</button>
                </Box>
                <Box>
                    <HomeOutlined twoToOneColor={color}></HomeOutlined>
                    <div className="person_de" style={{color: '#fff', background}}>let</div>
                </Box>
            </div>
        </div>
    }
}


export default function () {
    const [themeContextValue, setThemeContext] = React.useState(theme.dark);
    return <ThemeContext.Provider value={{
        ...themeContextValue,
        setTheme: setThemeContext
    }}>
        <App/>
    </ThemeContext.Provider>
}
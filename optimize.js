export default class Index extends React.Component{
    constructor(props){
        super(props)
        this.handleClick = debounce(this.handleClick, 500);
        this.handleChange = debounce(this.handleChange, 500);
    }
    handleClick = () => {}

    handleChange = (e) => {}

    render(){
        return <div>
            <input placeholder="搜索表单" onChange={this.handleChange}></input>
            <button onClick={this.handleClick}>click</button>
        </div>
    }
}

export default function Index(){
    const handleScroll = React.useCallback(throttle(function(){
        
    }, 300))
    return <div className="scrollIndex" onScroll={handleScroll}>
        <div className="scrollContent">hello</div>
    </div>
}


export default function Index(){
    const [isAnimation, setAnimation] = useState(false);
    return <div>
        <button onClick={() => setAnimation(true)}>change</button>
        <div className={isAnimation ? 'current animation' : 'current'}></div>
    </div>
}

// .current{
//     width: 500px;
//     height: 500px;
//     border-radius: 50%;
//     background: #fff;
//     border: 1px solid #ccc;
// }

// .animation{
//     animation: 1s changeColor;
//     background: yellowgreen;
// }

// @keyframes changeColor{
//     0%{
//         background: #c00;
//     }
//     50%{
//         background: orange;
//     }
//     100%{
//         background: yellowgreen;
//     }
// }

export default function Index(){
    const dom = React.useRef(null);
    const changeColor = () => {
        const target = dom.current;
        target.style.background = '#c00';
        setTimeout(() => {
            target.style.background = 'orange';
            setTimeout(() => {
                target.style.background = 'yellowgreen';
            }, 500)
        }, 500)
    }

    return <div>
        <button onClick={changeColor}></button>
        <div className="current" ref={dom}></div>
    </div>
}

function Index(){
    const [position, setPosition] = useState({
        left: 0,
        top: 0
    })
    const changePosition = () => {
        let time = 0;
        let timer = setInterval(() => {
            if(time === 30) clearInterval(timer);
            setPosition({
                left: time * 10,
                top: time * 10
            })
            time++
        }, 30)
    }

    const {left, top} = position;
    return <div>
        <button onClick={changePosition}></button>
        <div className="current" style={{transform: `translate(${left}px, ${top}px)`}}></div>
    </div>
}

export default class Index extends React.Component{
    current = null;
    poll = () => {}
    handleScroll = () => {}

    componentDidMount(){
        this.timer = setInterval(() => {
            this.poll()
        }, 2000)
        this.current.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount(){
        clearInterval(this.timer);
        this.current.removeEventListener('scroll', this.handleScroll)
    }
}

export default function Index(){
    const dom = React.useRef(null)
    const poll = () => {}
    const handleScroll = () => {}

    useEffect(() => {
        let timer = setInterval(() => {
            poll()
        }, 2000)

        dom.current.addEventListener('scroll', handleScroll)
        return function(){
            clearInterval(timer)
            dom.current.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return <div ref={dom}>let</div>
}


export default class Index extends React.Component{
    node = null
    scrollTop = 0
    handleScroll = () => {
        const {scrollTop} = this.node;
        this.scrollTop = scrollTop;
    }

    render(){
        return <div ref={(node) => this.node = node} onScroll={this.handleScroll}></div>
    }
}

export default function Index(){
    const dom = useRef(null);
    const scrollTop = useRef(0);
    const handleScroll = () => {
        scrollTop.current = dom.current.scrollTop;
    }
    return <div ref={dom} onScroll={handleScroll}></div>
}

function mountRef(initialValue){
    const hook = mountWorkInProgressHook();
    const ref = {
        current: initialValue
    }
    hook.memoizedState = ref;
    return ref;
}

function updateRef(initialValue){
    const hook = updateWorkInProgressHook();
    return hook.memoizedState;
}

const hook = useRef(null);
const value = useMemo(() => {
    hook.current = new Fn();
}, [changeValue])
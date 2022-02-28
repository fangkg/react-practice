function getColor(){
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b}, 0.8)`
}

function getPosition(position){
    const {width, height} = position;
    return {
        left: Math.ceil(Math.random() * width) + 'px',
        top: Math.ceil(Math.random() * height) + 'px'
    }
}

function Circle({position}){
    const style = React.useMemo(() => {
        return {
            background: getColor(),
            ...getPosition(position)
        }
    }, [])
    return <div style={style} className="circle"></div>
}

class Index extends React.Component{
    state = {
        dataList: [],
        renderList: [],
        position: {
            width: 0,
            height: 0
        }
    }

    box = React.createRef();
    componentDidMount(){
        const {offsetHeight, offsetWidth} = this.box.current;
        const originList = new Array(20000).fill(2);
        this.setState({
            position: {
                height: offsetHeight,
                width: offsetWidth
            },
            dataList: originList,
            renderList: originList
        })
    }

    render(){
        const {renderList, position} = this.state;
        return <div className="bigData_index" ref={this.box}>
            {
                renderList.map((item, index) => <Circle position={position} key={index}/>)
            }
        </div>
    }
}

export default () => {
    const [show, setShow] = useState(true);
    const [bthShow, setBthShow] = useStae(true);
    const handleClick = () => {
        setBthShow(false);
        setTimeout(() => {
            setShow(true)
        }, 100)
    }

    return <div>
        {
            bthShow && <button onClick={handleClick}>show</button>
        }
        {
            show && <Index/>
        }
    </div>
}

class Index extends React.Component{
    state = {
        dataList: [],
        renderList: [],
        position: {
            width: 0,
            height: 0
        },
        eachRenderNum: 500
    }

    box = React.createRef()
    componentDidMount(){
        const {offsetHeight, offsetWidth} = this.box.current;
        const originList = new Array(20000).fill(1);
        const times = Math.ceil(originList.length / this.state.eachRenderNum);
        let index = 1;
        this.setState({
            dataList: originList,
            position: {
                height: offsetHeight,
                width: offsetWidth
            }
        }, () => {
            this.toRenderList(index, times)
        })
    }

    toRenderList = (index, times) => {
        if(index > times) return
        const {renderList} = this.state;
        renderList.push(this.renderNewList(index))
        this.setState({
            renderList
        })
        requestIdleCallback(() => {
            this.toRenderList(++index, times)
        })
    }

    renderNewList(index){
        const {dataList, position, eachRenderNum} = this.state;
        const list = dataList.slice((index - 1) * eachRenderNum, index * eachRenderNum);
        return <React.Fragment key={index}>
            {
                list.map((item, index) => <Circle key={index} position={position}/>)
            }
        </React.Fragment>
    }

    render(){
        return <div className="bigData_index" ref={this.box}>
            {
                this.state.renderList
            }
        </div>
    }
}


function VirtualList(){
    const [dataList, setDataList] = React.useState([]);
    const [position, setPosition] = React.useState([0, 0]);
    const scroll = React.useRef(null);
    const box = React.useRef(null);
    const scrollInfo = React.useRef({
        height: 500,
        bufferCount: 8,
        itemHeight: 60,
        renderCount: 0
    })
    React.useEffect(() => {
        const height = box.current.offsetHeight;
        const {itemHeight, bufferCount} = scrollInfo.current;
        const renderCount = Math.ceil(height / itemHeight) + bufferCount;
        scrollInfo.current = {
            renderCount,
            height,
            bufferCount,
            itemHeight
        }
        const dataList = new Array(20000).fill(1).map((itme, index) => index + 1)
        setDataList(dataList)
        setPosition([0, renderCount])
    }, [])

    const handleScroll = () => {
        const {scrollTop} = scroll.current;
        const {itemHeight, renderCount} = scrollInfo.current;
        const currentOffset = scrollTop - (scrollTop % itemHeight);
        const start = Math.floor(scrollTop / itemHeight);
        context.current.style.transform = `translate3d(0, ${currentOffset}px, 0)`;
        const end = Math.floor(scrollTop / itemHeight + renderCount + 1);
        if(end !== position[1] || start !== position[0]){
            setPosition([start, end])
        }
    }

    const {itemHeight, height} = scrollInfo.current;
    const [start, end] = position;
    const renderList = dataList.slice(start, end);

    return <div className="list_box" ref={box}>
        <div className="scroll_box" style={{height: height + 'px'}} onScroll={handleScroll} ref={scroll}>
            <div className="scroll_hold" style={{height: `${dataList.length * itemHeight}px`}}></div>
            <div className="context" ref={context}>
                {
                    renderList.map((item, index) => <div className="list" key={index}>
                        {item + ""} item
                    </div>)
                }
            </div>
        </div>
    </div>
}
const toLearn = ['react', 'vue', 'webpack', 'nodejs']
const TextComponent = () => <div>hello</div>
class Index extends React.Component {
    status = false
    renderFoot = () => <div>foot</div>
    render(){
        return <div style={{marginTop: '100px'}}>
            <div>hello</div>
            <React.Fragment>
                fragment
            </React.Fragment>
            text 
            {
                toLearn.map(item => <div key={item}>learn</div>)
            }
            <TextComponent/>
            {
                this.status ? <TextComponent/> : <div>三元运算</div>
            }
            {
                this.renderFoot()
            }
            <button onClick={
                () => console.log(this.render())
            }>打印render后内容</button>
        </div>
    }
}


React.createElement(
    type,
    [props],
    [...children]
)



export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2;
export const HostRoot = 3;
export const HostPortal = 4;
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;


class Index extends React.Component{
    status = false
    renderFoot = () => <div>foot</div>

    controlRender = () => {
        const reactElement = (
            <div style={{ marginTop: '100px' }} className="container">
                <div>hello</div>
                <React.Fragment>
                    fragment
                </React.Fragment>
                text
                {
                    toLearn.map(item => <div key={item}>
                        learn {item}
                    </div>)
                }
                <TextComponent/>
                {
                    this.status ? <TextComponent/> : <div>三元</div>
                }
                {
                    this.renderFoot()
                }
                <button onClick={
                    () => console.log(this.render())
                }>打印render</button>
            </div>
        )

        console.log(reactElement)

        const {children} = reactElement.props;
        // 扁平化children
        const flatChildren = React.Children.toArray(children);
        console.log(flatChildren)
        // 除去文本节点
        const newChildren = [];
        React.Children.forEach(flatChildren, (item) => {
            if(React.isValidElement(item)) newChildren.push(item)
        })
        // 插入新节点
        const lastChildren = React.createElement('div', {
            className: 'last'
        }, 'say goodbye')
        newChildren.push(lastChildren)

        // 修改容器节点
        const newReactElement = React.cloneElement(reactElement, {}, ...newChildren);
        return newReactElement
    }

    render() {
        return this.controlRender()
    }
}
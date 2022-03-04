<Modal title={'title'} visible={visible}>
    <div>hello</div>
</Modal>

Modal.show({
    content: '内容',
    title: '标题',
    onOk: () => {},
    onCancel: () => {},
    onClose: () => Modal.hidden()
})

ReactDOM.createPortal(child, container);

ReactDOM.unmountComponentAtNode()


class Modal extends React.PureComponent{
    renderFooter = () => {
        const {onOk, onCancel, cancelText, okText, footer} = this.props;
        if(footer && React.isValidElement(footer)) return footer;
        return <div className="model_button">
            <button className="searchbtn" onClick={(e) => {onOk && onOk(e)}}>
                {okText || '确定'}
            </button>
            <button className="cancelbtn" onClick={onCancel && onCancel(e)}>
                {cancelText || '取消'}
            </button>
        </div>
    }

    renderTop = () => {
        const {title, onClose} = this.props;
        return <div className="model_top">
            <p>{title}</p>
            <span className="model_top_close" onClick={() => onClose && onClose()}></span>
        </div>  
    }

    renderContent = () => {
        const {content, children} = this.props;
        return React.isValidElement(content) ? content : children ? children : null;
    }

    render(){
        const {visible, width=500, closeCb, onClose} = this.props;
        return <Dialog
            closeCb={closeCb}
            onClose={onClose}
            visible={visible}
            width={width}>
            {this.renderTop()}
            {this.renderContent()}
            {this.renderFooter()}
        </Dialog>
    }
}

import React, {useMemo, useEffect, useState} from "react";
import ReactDOM from "react-dom";

const controlShow = (f1, f2, value, timer) => {
    f1(value);
    return setTimeout(() => {
        f2(value);
    }, timer)
}

export default function Dialog(props){
    const {width, visible, closeCb, onClose} = props;
    const [modelShow, setModelShow] = useState(visible);
    const [modelShowAsync, setModelShowAsync] = useState(visible);
    const renderChildren = useMemo(() => {
        return ReactDOM.createPortal(
            <div style={{ display: modelShow ? 'block' : 'none'}}>
                <div className="model_container" style={{opacity: modelShowAsync ? 1 : 0}}>
                    <div className="model_wrap">
                        <div style={{width: width + 'px'}}>
                            {props.children}
                        </div>
                    </div>
                </div>
                <div className="model_container mast" onClick={() => onClose && onClose()} style={{opacity: modelShowAsync ? 0.6 : 0}}></div>
            </div>
        )
    }, [modelShowAsync, modelShow])

    useEffect(() => {
        let timer;
        if(visible){
            timer = controlShow(setModelShow, setModelShowAsync, visible, 30)
        } else {
            timer = controlShow(setModelShowAsync, setModelShow, visible, 1000)
        }

        return function(){
            timer && clearTimeout(timer);
        }
    }, [visible])

    useEffect(() => {
        !modelShow && typeof closeCb === 'function' && closeCb()
    }, [modelShow]);

    return renderChildren;
}

let ModalContainer = null;
const modelSymbol = Symbol('$$__model__container__hidden');
Modal.show = function(config){
    if(ModalContainer) return
    const props = {...config, visible: true}
    const container = ModalContainer = document.createElement('div');
    const manager = container[modelSymbol] = {
        setShow: null,
        mounted: false,
        hidden(){
            const {setShow} = manager;
            setShow && setShow(false);
        },
        destroy(){
            ReactDOM.unmountComponentAtNode(container);
            document.body.removeChild(container);
            ModalContainer = null;
        }
    }

    const ModelApp = (props) => {
        const [show, setShow] = useState(false);
        manager.setShow = setShow;
        const {visible, ...trueProps} = props;
        useEffect(() => {
            manager.mounted = true;
            setShow(visible)
        }, [])
        return <Modal {...trueProps} 
            closeCb={() => manager.mounted && manager.destroy()} 
            visible={show}/>
    }

    document.body.appendChild(container);
    ReactDOM.render(<ModelApp {...props}/>, container);
    return manager;
}

Modal.hidden = function(){
    if(!ModalContainer) return
    ModalContainer[modelSymbol] && ModalContainer[modelSymbol].hidden();
}

export default function Index(){
    const [visible, setVisible] = useState(false);
    const [nameShow, setNameShow] = useState(false);
    const handleClick = () => {
        setVisible(!visible);
        setNameShow(!nameShow);
    }

    const [handleClose, handleOk, handleCancel] = useMemo(() => {
        const Ok = () => {}
        const Close = () => {}
        const Cancel = () => {}
        return [Close, Ok, Cancel]
    })

    return <div>
        <Modal onCancel={handleCancel}
            onClose={handleClose}
            onOk={handleOk}
            title={'title'}
            visible={visible}
            width={700}>
            <div className="feel">
                <input placeholder="feel"></input>
                {nameShow && <p>feel</p>}
            </div>
        </Modal>
        <button onClick={() => {
            setVisible(!visible)
            setNameShow(false)
        }}>model show</button>
        <button onClick={handleClick}></button>
    </div>
}

export default function Index(){
    const handleClick = () => {
        Modal.show({
            content: 'content',
            title: 'title',
            onOk: () => {},
            onCancel: () => {},
            onClose: () => Modal.hidden()
        })
    }

    return <div>
        <button onClick={() => handleClick()}>show</button>
    </div>
}
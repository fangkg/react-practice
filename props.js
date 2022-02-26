import React from "react";

function ChildrenComponent(){
    return <div>child</div>
}

class PropsComponent extends React.Component{
    componentDidMount(){}

    render(){
        const {
            children,
            mes,
            renderName,
            say,
            Component
        } = this.props;

        const renderFunction = children[0]
        const renderComponent = children[1]

        return <div>
            {
                renderFunction()
            }
            {
                mes
            }
            {
                renderName()
            }
            {
                renderComponent
            }
            <Component/>
            <button onClick={
                () => say()
            }>change</button>
        </div>
    }
}


class Index extends React.Component{
    state = {
        mes: 'react'
    }
    node = null

    say = () => this.setState({
        mes: 'tt'
    })

    render(){
        return <div>
            <PropsComponent
                mes={this.state.mes}
                say={this.say}
                Component={ChildrenComponent}
                renderName={() => <div>alien</div>}>
                    {() => <div>hello</div>}
                    <ChildrenComponent/>
                </PropsComponent>
        </div>
    }
}

{/* <Container>
    <Children/>
</Container>

<Container>
    {
        (ContainerProps) => <Children {...ContainerProps}/>
    }
</Container> */}

function Container(props){
    return props.children;
}

function Container(props){
    const ContainerProps = {
        name: 'alien'
    }
    // return props.children(ContainerProps);
    return props.children.map(item => {
        if(React.isValidElement(item)){
            return React.cloneElement(item, {...ContainerProps}, item.props.children)
        } else if(typeof item === 'function'){
            return item(ContainerProps)
        } else {
            return null
        }
    })
}

const Index = () => {
    return <Container>
        <Children/>
        {
            (ContainerProps) => <Children {...ContainerProps} name={'haha'}/>
        }
    </Container>
}


function Son(props){
    return <div>son</div>
}

function Father(props){
    // const fatherProps = {
    //     mes: 'father'
    // }
    const {age, ...fatherProps} = props
    return <Son {...props} {...fatherProps}/>
}

function Index(){
    const indexProps = {
        name: 'index',
        age: 23,
        tt: 'let'
    }

    return <Father {...indexProps}/>
}


function Son(props){
    return <div>son</div>
}

function Father(prop){
    // return prop.children
    return React.cloneElement(prop.children, {mes: 'let'})
}

function Index(){
    return <Father>
        <Son name="alien" age="34"/>
    </Father>
}


export default () => {
    const form = React.useRef(null)
    const submit = () => {
        form.current.submitForm((formValue) => {

        })
    }

    const reset = () => {
        form.current.resetForm()
    }

    return <div className="box">
        <Form ref={form}>
            <FormItem name="name" labe="姓名">
                <Input/>
            </FormItem>
        </Form>
        <div className="btns">
            <button className="searchBtn" onClick={submit}>提交</button>
            <button className="cancelBtn" onClick={reset}>重置</button>
        </div>
    </div>
}

class Form extends React.Component{
    state = {
        formData: {}
    }

    submitForm = (cb) => {
        cb({
            ...this.state.formData
        })
    }

    resetForm = () => {
        const { formData } = this.state;
        Object.keys(formData).forEach(item => {
            formData[item] = ""
        })
        this.setState({
            formData
        })
    }

    setValue = (name, value) => {
        this.setState({
            formData: {
                ...this.state.formData,
                [name]: value
            }
        })
    }

    render(){
        const {children} = this.props
        const renderChildren = []
        React.Children.forEach(children, (child) => {
            if(child.type.displayName === 'formItem'){
                const {name} = child.props;
                const Children = React.cloneElement(child, {
                    key: name,
                    handleChange: this.setValue,
                    value: this.state.formData[name] || ""
                }, child.props.children)
                renderChildren.push(Children)
            }
        })

        return renderChildren
    }
}
Form.displayName = "form";

function FormItem(props){
    const {children, name, handleChange, value, label} = props
    const onChange = (value) => {
        handleChange(name, value)
    }

    return <div className="form">
        <span className="label">{label}:</span>
        {
            React.isValidElement(children) && children.type.displayName === 'input'
                ? React.cloneElement(children, { onChange, value })
                : null
        }
    </div>
}
FormItem.displayName = "formItem";

function Input({onChange, value}){
    return <input className="input" onChange={(e) => (onChange && onChange(e.target.value))} value={value}/>
}
Input.displayName = 'input'
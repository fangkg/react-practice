const formInstanceApi = [
    'setCallback',
    'dispatch',
    'registerValidateFields',
    'resetFields',
    'setFields',
    'setFieldsValue',
    'getFieldsValue',
    'getFieldValue',
    'validateFields',
    'submit',
    'unRegisterValidate'
]

const isReg = (value) => value instanceof RegExp;
class FormStore{
    constructor(forceUpdate, defaultFormValue={}){
        this.FormUpdate = forceUpdate;
        this.model = {};
        this.control = {};
        this.isSchedule = false;
        this.callback = {};
        this.penddingValidateQueue = [];
        this.defaultFormValue = defaultFormValue;
    }

    getForm(){
        return formInstanceApi.reduce((map, item) => {
            map[item] = this[item].bind(this)
            return map
        }, {})
    }

    static createValidate(validate){
        const {value, rule, required, message} = validate;
        return {
            value,
            rule: rule || (() => true),
            required: required || false,
            message: message || "",
            status: 'pending'
        }
    }

    setCallback(callback){
        if(callback) this.callback = callback
    }

    dispatch(action, ...arg){
        if(!action && typeof action !== 'object') return null;
        const {type} = action;
        if(~formInstanceApi.indexOf(type)) {
            return this[type](...arg);
        } else if(typeof this[type] === 'function'){
            return this[type](...arg);
        }
    }

    registerValidateFields(name, control, model){
        if(this.defaultFormValue[name]) model.value = this.defaultFormValue[name];
        const validate = FormStore.createValidate(model);
        this.model[name] = validate;
        this.control[name] = control;
    }

    unRegisterValidate(name){
        delete this.model[name];
        delete this.control[name];
    }

    nofityChange(name){
        const controller = this.control[name];
        if(controller) controller.changeValue()
    }

    resetFields(){
        Object.keys(this.model).forEach(modelName => {
            this.setValueClearStatus(this.model[modelName], modelName, null)
        })
    }

    setFields(object){
        if(typeof object !== 'object') return
        Object.keys(object).forEach(modelName => {
            this.setFieldsValue(modelName, object[modelName]);
        })
    }

    setFieldsValue(name, modelValue){
        const model = this.model[name];
        if(!model) return false;
        if(typeof modelValue === 'object'){
            const {message, rule, value} = modelValue;
            if(message) model.message = message;
            if(rule) model.rule = rule;
            if(value) model.value = value;
            model.status = 'pending';
            this.validateFieldValue(name, true)
        } else {
            this.setValueClearStatus(model, name, modelValue);
        }
    }

    setValueClearStatus(model, name, value){
        model.value = value;
        model.status = "pending";
        this.nofityChange(name);
    }

    getFieldsValue(){
        const formData = [];
        Object.keys(this.model).forEach(modelName => {
            formData[modelName] = this.model[modelName].value
        }) 
        return formData;
    }

    getFieldValue(){
        const model = this.model[name];
        if(!model && this.defaultFormValue[name]) return this.defaultFormValue[name];
        return model ? model.value : null;
    }

    validatFieldValue(name, forceUpdate = false){
        const model = this.model[name];
        const lastStatus = model.status;
        if(!model) return null
        const {required, rule, value } = model;
        let status = 'resolve';
        if(required && !value){
            status = 'reject';
        } else if(isReg(rule)){
            status = rule.test(value) ? 'resolve' : 'reject';
        } else if(typeof rule === 'function'){
            status = rule(value) ? 'resolve' : 'reject';
        }

        model.status = status;
        if(lastStatus !== status || forceUpdate){
            const notify = this.notifyChange.bind(this, name);
            this.penddingValidateQueue.push(notify);
        }
        this.scheduleValidate();
        return status;
    }

    scheduleValidate(){
        if(!this.isSchedule) return
        this.isSchedule = true;
        Promise.resolve().then(() => {
            unstable_batchedUpdates(() => {
                do{
                    let notify = this.penddingValidateQueue.shift();
                    notify && notify()
                } while(this.penddingValidateQueue.length > 0)
                this.isSchedule = false;
            })
        })
    }

    validateFields(callback){
        let status = true;
        Object.keys(this.model).forEach(modelName => {
            const modelStatus = this.validatFieldValue(modelName, true);
            if(modelStatus === 'reject') status = false;
        })
        callback(status);
    }

    submit(cb){
        this.validateFields((res) => {
            const {onFinish, onFinishFailed} = this.callback
            cb && cb(res);
            if(!res) onFinishFailed && typeof onFinishFailed === 'function' && onFinishFailed()
            onFinish && typeof onFinish === 'function' && onFinish(this.getFieldsValue());
        })
    }
}

function useForm(form, defaultFormValue = {}){
    const formRef = React.useRef(null);
    const [, forceUpdate] = React.useState([]);
    if(!formRef.current){
        if(form){
            formRef.current = form;
        } else {
            const formStoreCurrent = new FormStore(forceUpdate, defaultFormValue);
            formRef.current = formStoreCurrent.getForm();
        }
    }
    return formRef.current;
}

import { createContext, isValidElement, useEffect, useImperativeHandle } from "react";
const FormContext = createContext();
export default FormContext;

function Form({
    form,
    onFinish,
    onFinishFailed,
    initialValue,
    children
}, ref){
    const formInstance = useForm(form, initialValue);
    const {
        setCallback,
        dispatch,
        ...providerFormInstance
    } = formInstance;

    setCallback({
        onFinish,
        onFinishFailed
    })

    useImperativeHandle(ref, () => providerFormInstance, []);

    const renderChildren = <FormContext.Provider value={formInstance}>
        {children}
    </FormContext.Provider>

    return <form onReset={(e) => {
        e.preventDefault()
        e.stopPropagation()
        formInstance.resetFields()
    }}
    onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        formInstance.submit();
    }}>
        {
            renderChildren
        }
    </form>
}

export default React.forwardRef(Form);

function FormItem({
    name,
    children,
    label,
    height = 50,
    labelWidth,
    required = false,
    rules = {},
    trigger = 'onChange',
    validateTrigger = 'onChange'
}){
    const formInstance = useContext(FormContext);
    const {
        registerValidateFields,
        dispatch,
        unRegisterValidate
    } = formInstance;
    const [, forceUpdate] = useState([]);
    const onStoreChange = useMemo(() => {
        const onStoreChange = {
            changeValue(){
                forceUpdate({})
            }
        }
        return onStoreChange
    }, [formInstance])

    useEffect(() => {
        name && registerValidateFields(name, onStoreChange, {
            ...rules,
            required
        })
        return function(){
            name && unRegisterValidate(name);
        }
    }, [onStoreChange])

    const getControlled = (child) => {
        const mergeChildrenProps = {
            ...child.props
        }
        if(!name) return mergeChildrenProps;
        const handleChange = (e) => {
            const value = e.target.value;
            dispatch({
                type: 'setFieldsValue'
            }, name, value)
        }

        mergeChildrenProps[trigger] = handleChange;
        if(required || rules){
            mergeChildrenProps[validateTrigger] = (e) => {
                if(validateTrigger === trigger){
                    handleChange(e)
                }
                dispatch({
                    type: 'validateFieldValue'
                }, name)
            }
        }

        mergeChildrenProps.value = dispatch({type: 'getFieldValue'}, name) || "";
        return mergeChildrenProps;
    }

    let renderChildren
    if(isValidElement(children)){
        renderChildren = React.cloneElement(children, getControlled(children))
    } else {
        renderChildren = children;
    }

    return <Label   height={height}
        label={label}
        labelWidth={labelWidth}
        required={required}>
            {renderChildren}
            <Meaage name={name}
                {...dispatch({type: 'getFieldModel'}, name)}/>
    </Label>
}

<FormItem label="名称"
    labelWidth={150}
    name="name"
    required
    rules={{
        rule: '',
        message: ''
    }}
    trigger="onChange"
    validateTrigger="onBlur">
        <Input placeholder="名称"></Input>
</FormItem>

function Label({children, label, labelWidth, required, height}){
    return <div className="form-label" style={{height: height + 'px'}}>
        <div className="form-label-name" style={{width: `${labelWidth}px`}}>
            {required ? <span style={{color: 'red'}}>*</span> : null}
            {label}:
        </div>
    </div>
}

function Message(props){
    const {status, message, required, name, value} = props;
    let showMessage = "";
    let color = "#fff";
    if(required && !value && status === 'reject'){
        showMessage = `${name}必填`;
        color = 'red';
    } else if(status === 'reject'){
        showMessage = message;
        color = 'red';
    } else if(status === 'pending'){
        showMessage = null;
    } else if(status === 'resolve'){
        showMessage = "校验通过";
        color = 'green';
    }

    return <div className="form-message">
        <span style={{color}}>{showMessage}</span>
    </div>
}

const Input = (props) => {
    return <input className="form-input" {...props}/>
}

function Select({children, ...props}){
    return <select {...props} className="form-input">
        <option label={props.placeholder} value={null}>
            {props.placeholder}
        </option>
        {children}
    </select>
}

Select.Option = function(props){
    return <option {...props} className="" label={props.children}></option>
}

export default Select;

Form.FormItem = FormItem;
export {
    Form,
    Select,
    Input,
    FormItem
}

import React, {useRef, useEffect} from "react";
import Form, {Input, Select} from "./form";
const FormItem = Form.FormItem;
const Option = Select.Option;

function Index(){
    const form = useRef(null);
    useEffect(() => {}, [])

    const handleClick = () => {
        form.current.submit((res) => {})
    }

    const handleGetValue = () => {}

    return <div style={{marginTop: '50px'}}>
        <Form initialValues={{author: 'll'}} ref={form}>
            <FormItem label="名称" labelWidth={150} name="name" required rules={{rule: '', message: ""}}>
                <Input placeholder="名称"></Input>
            </FormItem>
            <button className="searchbtn" onClick={handleClick} type="button">submit</button>
            <button className="cancelbtn" type="reset"></button>
        </Form>
    </div>
}
import React from "react";
import {Form, Input, Button, DatePicker, TimePicker, Typography, Row, message, Space} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';

import moment from 'moment';

import 'moment/locale/zh-cn';

//导入自己的模块
import {addLocalStorage} from "../interface/TDLocalStorage.js";

moment.locale('zh-cn');//解决日期选择框出现部分英文问题

const { TextArea } = Input;
const { Title } = Typography;

export default class Addtodo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            title:'',
            date:'',
            time:'',
            content:''
        };
    }

    componentDidMount(){
        this.refs.titleInput.focus();//给标题设置自动聚焦
    }

    titleChange = (e)=>{
        if(e.target.value.length > 10){
            message.destroy();
            message.warning("标题字数不能超过十个");
            return;
        }
        this.setState({
            title:e.target.value
        });
    };
    dateChange = (date, dateString)=>{
        this.setState({
            date:dateString
        });
    };
    timeChange = (time, timeString)=>{
        this.setState({
            time:timeString
        });
    };
    contentChange = (e)=>{
        this.setState({
            content:e.target.value
        });
    };
    addClick = (e)=>{
        e.preventDefault();
        //检查数据的完整性
        if (!this.state.title || !this.state.date || !this.state.content){
            message.destroy();
            message.warning("请输入完整的待办事项信息！");
            return;
        }
        //将所有的数据拿取出来，并给该待办事添加id
        let addevent = {
            id:this.randomID(),
            ...this.state
        };
        //若没有选择具体时间，默认为0点
        if (!this.state.time){
            addevent.time = "00:00:00";
        }

        //向localSrorage中获取数据
        addLocalStorage("event", addevent);

        this.props.history.push({
            pathname:'/todolist'
        });
    };

    backClick = (e)=>{
        e.stopPropagation();
        this.props.history.push({
            pathname:'/todolist'
        });
    };

    //随机生成一个ID
    randomID(){
        return Number(Math.random().toString().substr(3,5) + Date.now()).toString(36);
    }

    render(){
        return (
            <div>
                <Row justify="center"><Title level={4} type="secondary">添加待办事项</Title></Row>
                <Form
                    layout={"vertical"}
                >
                    <Form.Item label="标题：">
                        <Input placeholder="待办事标题(最多十个字)" value={this.state.title} onChange={this.titleChange} ref="titleInput"/>
                    </Form.Item>
                    <Form.Item label="日期：">
                        <DatePicker locale={locale} onChange={this.dateChange}/>
                        <TimePicker locale={locale} onChange={this.timeChange}/>
                    </Form.Item>
                    <Form.Item label="内容：">
                        <TextArea placeholder="待办事内容" rows={6} style={{resize:"none"}} value={this.state.content} onChange={this.contentChange}/>
                    </Form.Item>
                    <Form.Item >
                        <Space>
                            <Button type="primary" onClick={(e)=>{this.addClick(e)}} >添加</Button>
                            <Button type="primary" onClick={(e)=>{this.backClick(e)}}>返回</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
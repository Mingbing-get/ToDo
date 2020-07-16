import React from "react";
import { Typography, Row, Space, Button } from 'antd';

//导入自己的模块
import TD from "../interface/TDLocalStorage";

const { Title, Text } = Typography;

export default class Looktodo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            title:'',
            date:'',
            time:'',
            content:''
        };
    }

    //初始化取得数据
    componentDidMount(){
        let sdata = TD.getLocalStorageById(this.props.match.params.state, this.props.match.params.id);
        this.setState({
            title:sdata.title,
            date:sdata.date,
            time:sdata.time,
            content:sdata.content
        });
    };

    backClick = (e)=>{
        e.stopPropagation();
        this.props.history.push({
            pathname:'/todolist'
        });
    };

    render(){
        const nowrap = {whiteSpace:"nowrap"};

        return (
            <div>
                <Row justify="center"><Title level={4} type="secondary">
                    {this.props.match.params.state === 'event'?'待办事项详情':'已完成事项详情'}
                </Title></Row>
                <Space direction="vertical">
                    <Space>
                        <Text strong style={nowrap}>标题：</Text>
                        <Text>{this.state.title}</Text>
                    </Space>
                    <Space>
                        <Text strong style={nowrap}>时间：</Text>
                        <Text>{this.state.date+' '+this.state.time}</Text>
                    </Space>
                    <Space>
                        <Text strong style={nowrap}>内容：</Text>
                        <Text>{this.state.content}</Text>
                    </Space>
                    <Button type="primary" onClick={(e)=>{this.backClick(e)}}>返回</Button>
                </Space>
            </div>
        )
    }
}
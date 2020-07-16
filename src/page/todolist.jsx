import React from 'react';
import { List, Row, Button, Col, Typography, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

//导入自己的封装
import TD from '../interface/TDLocalStorage.js';

import '../css/todolist.css';

const { Text } = Typography;
const { confirm } = Modal;

export default class Todolist extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            liststate:'event',
            data:[],
            page:1,
            pageSize:6,
            visibledelete:false,
            visivlecomplete:false
        };
    };

    //初始化取得数据
    componentDidMount(){
        //获取待办事，并将待办事的数据添加到数据中
        this.setState({
            data:this.getdata("event")
        });
    };

    //获取数据,根据key(取值可为event，complete。默认是event)的不同获取到待完成数据和已完成数据
    getdata(key){
        key = key || "event";

        //获事项的数据
        let event = TD.getLocalStorage("event");
        let complete = TD.getLocalStorage("complete");
        //对拿到的数据按时间升序进行排序
        event = event.sort(this.DESCcompare);

        //对排序的数据进行检查，若有时间小于现在的时间，则将这些事项添加到已完成中
        let count = -1;
        let now = new Date();
        for (var i = 0; i < event.length; i++){
            if (new Date(event[i].date+' '+event[i].time) > now){
                count = i;
                break;
            }
        }
        if (count !== 0){
            if (count > 0){
                let temp = event.splice(0,count);
                complete = complete.concat(temp);
            }
            else {
                complete = complete.concat(event);
                complete = complete.sort(this.ASCcompare);//对新生成的数据排序
                event = [];
            }
            //将改变后的结果保存到localStorage中
            localStorage.setItem("event", JSON.stringify(event));
            localStorage.setItem("complete", JSON.stringify(complete));
        }
        //根据key的不同，返回对应的数据
        if (key === "event")
            return event;
        else
            return complete;
    }

    //自定义排序方式，按时间升序排列
    DESCcompare(e1, e2){
        if (new Date(e1.date+' '+e1.time) > new Date(e2.date+' '+e2.time))
            return 1;
        else
            return -1;
    };

    //自定义排序方式，按时间降序排列
    ASCcompare(e1, e2){
        if (new Date(e1.date+' '+e1.time) > new Date(e2.date+' '+e2.time))
            return -1;
        else
            return 1;
    };

    //跟新某个数据，则去到编辑的界面
    updateItem = (index, e)=>{
        this.props.history.push('/update/'+this.state.data[index].id);
        e.stopPropagation();
    };

    //添加数据，则去到添加数据的界面
    addItem = (e)=>{
        this.props.history.push({
            pathname:'/addtodo',
        });
        e.stopPropagation();
    };

    //查看某个事项的详情，去到详情页面
    lookItem = (index)=>{
        //将对应的index调换到真实的index
        index += (this.state.page-1)*this.state.pageSize;
        this.props.history.push('/looktodo/'+this.state.liststate+'/'+this.state.data[index].id);
    };

    //去到已完成事项页面
    toggle = (e, key)=>{
        e.stopPropagation();
        //切换数据
        this.setState({
            liststate:key,
            data:this.getdata(key)
        });
        //切换样式, 利用排他的功能
        let current = e.target;
        let other = current.parentNode.parentNode.childNodes;
        other.forEach(function (element) {
            element.children[0].className = "";
        });
        current.className = "active";
    };

    //设置提示框
    deleteItem = (index, e, key)=> {
        e.stopPropagation();
        var that = this;
        confirm({
            title: '提示！',
            icon: <ExclamationCircleOutlined />,
            content: '确认删除事项？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                let data = that.state.data;

                //将localStorage中对应的数据删除,返回1表示删除成功，否则删除失败
                let ok = TD.removeLocalStorage(key, data[index].id);
                if (ok === 0){
                    message.destroy();
                    message.warning("删除事项失败！");
                    return;
                }

                //删除成功，则将现有的数据同步删除
                data.splice(index,1);
                that.setState({
                    data
                });
            },
        });
    };
    addToComplete = (index, e)=> {
        e.stopPropagation();
        var that = this;
        confirm({
            title: '提示！',
            icon: <ExclamationCircleOutlined />,
            content: '确认完成事项？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                let data = that.state.data;

                //将localStorage中对应的数据删除,返回1表示删除成功，否则删除失败
                let ok = TD.removeLocalStorage("event", data[index].id);
                if (ok === 0){
                    message.destroy();
                    message.warning("删除事项失败！");
                    return;
                }

                //删除成功，则将现有的数据同步删除
                let temp = data.splice(index,1);
                let complete = TD.getLocalStorage("complete");
                complete = complete.concat(temp);
                complete.sort(that.ASCcompare);
                localStorage.setItem("complete", JSON.stringify(complete));

                that.setState({
                    data
                });
            },
        });
    };

    getzujian(index){
        //将对应的index调换到真实的index
        index += (this.state.page-1)*this.state.pageSize;

        return (
            this.state.liststate === 'event'?
            [
                <a key={index} onClick={(e)=>{this.addToComplete(index, e)}}>完成</a>,
                <a key={index} onClick={(e)=>{this.updateItem(index, e)}}>编辑</a>,
                <a key={index} onClick={(e)=>{this.deleteItem(index, e, this.state.liststate)}}>删除</a>
            ]
                :
            [
                <a key={index} onClick={(e)=>{this.deleteItem(index, e, this.state.liststate)}}>删除</a>
            ]
        );
    }

    render(){
        return (
            <div>
                <Row justify="center" className="tdhead">
                    <ul>
                        <li><a onClick={(e)=>{this.toggle(e, "event")}} className="active">待办事项</a></li>
                        <li><a onClick={(e)=>{this.toggle(e, "complete")}}>已完成事项</a></li>
                    </ul>
                </Row>
                <List
                    pagination={{
                        onChange: page => {
                            this.setState({
                                page
                            });
                        },
                        pageSize: this.state.pageSize
                    }}
                    dataSource={this.state.data}
                    renderItem={(item,index) => (<List.Item
                        actions={this.getzujian(index)}
                        onClick={()=>{this.lookItem(index)}}
                        className="tditem"
                    >
                        <Row>
                            <Col span={24}><Text strong>事项时间：</Text>{item.date+' '+item.time}</Col>
                            <Col span={24}><Text strong>事项标题：</Text>{item.title}</Col>
                        </Row>
                    </List.Item>)}
                />
                <Row justify="center" className="tdmt10">
                    <Button type="primary" size={"middle"} shape="round" onClick={(e)=>{this.addItem(e)}}>
                        添加待办事项
                    </Button>
                </Row>
            </div>
        )
    }
}
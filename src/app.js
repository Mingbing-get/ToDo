import React from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";

import Todolist from './page/todolist.jsx';
import Update from './page/update.jsx';
import Addtodo from './page/addtodo.jsx';
import Looktodo from './page/looktodo.jsx';

import './css/app.css'

export default class App extends React.Component{

    render(){ // 新加注释

        return (
            <div className="appcontainer">
                <HashRouter>
                    <Redirect from="/" to="/todolist"></Redirect>
                    <Route exact path="/todolist" component={Todolist}></Route>
                    <Route exact path="/update/:id" component={Update}></Route>
                    <Route exact path="/addtodo" component={Addtodo}></Route>
                    <Route exact path="/looktodo/:state/:id" component={Looktodo}></Route>
                </HashRouter>
            </div>
        )
    }
}
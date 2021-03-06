import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import Home from './components/Home';
import Nav from './components/Nav';
import UserLogin from './components/UserLogin';
import UserSignup from './components/UserSignup';
import TaskCreate from './components/TaskCreate';
import TasksFetch from './components/TasksFetch';
import Calendar from './components/Calendar';
import {PrivateRoute} from "./components/PrivateRoute";
import DaySchedule from "./components/DaySchedule";

ReactDOM.render(
  <Router>
    <div>
      <Nav/>

      <Route exact path={'/'} component={Home}/>
      <Route exact path={'/user'} component={UserSignup}/>
      <Route exact path={'/user/login'} component={UserLogin}/>

      <PrivateRoute exact path={'/tasks'} component={TasksFetch}/>
      <PrivateRoute exact path={"/task/:id?"} component={TaskCreate}/>
      <PrivateRoute exact path={'/schedule/:year/:month/:day'} component={DaySchedule}/>

      <PrivateRoute exact path={'/calendar'} component={Calendar}/>
    </div>
  </Router>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

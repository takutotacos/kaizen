import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import App from './App';
import Nav from './components/Nav';
import UserLogin from './components/UserLogin';
import UserSignup from './components/UserSignup';
import TaskCreate from './components/TaskCreate';
import TasksFetch from './components/TasksFetch';
import Calendar from './components/Calendar';

ReactDOM.render(
  <Router>
    <div>
      <Nav/>

      <Route exact path={'/'} component={App}/>
      <Route exact path={'/user'} component={UserSignup}/>
      <Route exact path={'/user/login'} component={UserLogin}/>

      <Route exact path={'/tasks'} component={TasksFetch}/>
      <Route exact path={"/task/:id?"} component={TaskCreate}/>

      <Route exact path={'/calendar'} component={Calendar}/>
    </div>
  </Router>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

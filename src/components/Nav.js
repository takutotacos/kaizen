import '../stylesheets/common/button.scss'
import '../stylesheets/common/margin.scss'
import '../stylesheets/common/padding.scss'
import '../stylesheets/common/color.scss'
import '../util/UserService'
import UserService from "../util/UserService";

let React = require('react');
let NavLink = require('react-router-dom').NavLink;

let logout = () => {
  let service = new UserService();
  service.logout();
  this.props.history.push('/');
}

let Nav = () => {
  let user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className={'navbar navbar-dark fixed-top green flex right padding-s'}>
      <NavLink exact activeClassName={'active'} to={'/task'} className={'margin-l-s button'}>New Task!</NavLink>
      <NavLink exact activeClassName={'active'} to={'/tasks'} className={'margin-l-s button'}>Tasks</NavLink>
      <NavLink exact activeClassName={'active'} to={'/calendar'} className={'margin-l-s button'}>Calendar</NavLink>
      {user && <NavLink exact activeClassName={'active'} to={'/profile'} className={'margin-l-s button'}>Welcome, {user.name}!</NavLink>}
      {user && <NavLink exact activeClassName={'active'} to={'/'} onClick={logout} className={'margin-l-s button'}>Logout</NavLink>}

      {!user && <NavLink exact activeClassName={'active'} to={'/user'} className={'button'}>Signup</NavLink>}
      {!user && <NavLink exact activeClassName={'active'} to={'/user/login'} className={'button'}>Login</NavLink>}
    </div>
  )
}

export default Nav;
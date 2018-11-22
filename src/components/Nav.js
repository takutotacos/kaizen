import '../stylesheets/common/button.scss'
import '../stylesheets/common/margin.scss'
import '../stylesheets/common/padding.scss'
import '../stylesheets/common/color.scss'

let React = require('react');
let NavLink = require('react-router-dom').NavLink;

let Nav = () => {
  let user = localStorage.getItem('user');
  return (
    <div className={'navbar navbar-dark fixed-top green flex align-center padding-s'}>
      <NavLink exact activeClassName={'active'} to={'/'} className={'button'}>Home</NavLink>
      <NavLink exact activeClassName={'active'} to={'/task'} className={'margin-l-s button'}>New Task!</NavLink>
      <NavLink exact activeClassName={'active'} to={'/tasks'} className={'margin-l-s button'}>Tasks</NavLink>
      <NavLink exact activeClassName={'active'} to={'/calendar'} className={'margin-l-s button'}>Calendar</NavLink>

      {!user && <NavLink exact activeClassName={'active'} to={'/user'} className={'button'}>Signup</NavLink>}
      {!user && <NavLink exact activeClassName={'active'} to={'/user/login'} className={'button'}>Login</NavLink>}
    </div>
  )
}

export default Nav;
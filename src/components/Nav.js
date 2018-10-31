import '../stylesheets/button.scss'

let React = require('react');
let NavLink = require('react-router-dom').NavLink;

let Nav = () => {
  return (
    <div className={'flex'}>
      <NavLink exact activeClassName={'active'} to={'/'} className={'button'}>Home</NavLink>
      <NavLink exact activeClassName={'active'} to={'/task'} className={'margin-l-s button'}>New Task!</NavLink>
      <NavLink exact activeClassName={'active'} to={'/tasks'} className={'margin-l-s button'}>Tasks</NavLink>
      <NavLink exact activeClassName={'active'} to={'/'} className={'margin-l-s button'}>Day</NavLink>
      <NavLink exact activeClassName={'active'} to={'/'} className={'margin-l-s button'}>Time Frame</NavLink>
    </div>
  )
}

export default Nav;
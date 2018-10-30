let React = require('react');
let NavLink = require('react-router-dom').NavLink;

let Nav = () => {
  return (
    <div className={'flex'}>
      <NavLink exact activeClassName={'active'} to={'/'}>Home</NavLink>
      <NavLink exact activeClassName={'active'} to={'/tasks'} className={'margin-l-s'}>Task</NavLink>
      <NavLink exact activeClassName={'active'} to={'/'} className={'margin-l-s'}>Day</NavLink>
      <NavLink exact activeClassName={'active'} to={'/'} className={'margin-l-s'}>Time Frame</NavLink>
    </div>
  )
}

module.exports = Nav;
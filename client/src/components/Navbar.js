import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {
  const {state, dispatch} = useContext(UserContext)
  const renderList = () => {
    if(state){
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>
      ]
    }else{
      return [
        <li><Link to="/signin">Signin</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
    }
  }
    return(
        <nav className="light-blue darken-4">
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}

export default Navbar
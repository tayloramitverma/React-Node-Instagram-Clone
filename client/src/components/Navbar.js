import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {

  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()

  const renderList = () => {
    if(state){
      return [
        <li key="0"><Link to="/profile">Profile</Link></li>,
        <li key="1"><Link to="/create">Create Post</Link></li>,
        <li key="2">
          <button onClick={()=>logoutMe()} className="btn red darken-2" >
              Logout
          </button>
        </li>
      ]
    }else{
      return [
        <li key="0"><Link to="/signin">Signin</Link></li>,
        <li key="1"><Link to="/signup">Signup</Link></li>
      ]
    }
  }

  const logoutMe = () => {
    localStorage.clear()
    dispatch({type:"CLEAR"})
    history.push('/signin')
  }

  return(
    <nav className="light-blue darken-4">
      <div className="nav-wrapper">
        <Link to={state?'/':'/signin'}className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
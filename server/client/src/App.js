import React, {useEffect, createContext, useReducer, useContext} from 'react'
import './App.css'

import Navbar from './components/container/Navbar'
import Footer from './components/container/Footer'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import ResetPassword from './components/screens/ResetPassword'
import UpdatePassword from './components/screens/UpdatePassword'
import UserProfile from './components/screens/UserProfile'
import UpdateProfile from './components/screens/UpdateProfile'
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory()
  const {dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user})
      if(history.location.pathname === '/signin' || history.location.pathname === '/signup'){
        history.push('/')
      }
    }else{
      if(!history.location.pathname === '/reset-password' || !history.location.pathname === '/update-password')
        history.push('/signin')
    }
  },[history,dispatch])

  return(
    <>
      <Switch>
        <Route exact path="/">
            <Home />
        </Route>
        <Route exact path="/profile">
            <Profile />
        </Route>
        <Route exact path="/update-profile">
            <UpdateProfile />
        </Route>
        <Route exact path="/create">
            <CreatePost />
        </Route>
        <Route exact path="/profile/:userid">
            <UserProfile />
        </Route>
        <Route exact path="/signin">
            <Signin />
        </Route>
        <Route exact path="/signup">
            <Signup />
        </Route>
        <Route exact path="/reset-password">
            <ResetPassword />
        </Route>
        <Route exact path="/update-password/:token">
            <UpdatePassword />
        </Route>
      </Switch>
    </>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar/>
        <Routing/>
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

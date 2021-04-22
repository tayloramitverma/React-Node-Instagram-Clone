import React, {useEffect, createContext, useReducer, useContext} from 'react'
import './App.css'

import Navbar from './components/Navbar'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
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
      history.push('/signin')
    }
  },[history,dispatch])

  return(
    <>
      <Switch>
        <Route exact path="/">
            <Home />
        </Route>
        <Route path="/profile">
            <Profile />
        </Route>
        <Route path="/create">
            <CreatePost />
        </Route>
        <Route path="/signin">
            <Signin />
        </Route>
        <Route path="/signup">
            <Signup />
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
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

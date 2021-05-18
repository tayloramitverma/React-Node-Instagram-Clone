import React,{ useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Signin = () => {
    const {dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const userAuth = () => {
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Email is not valid!", classes:"blue lighten-2"})
            return
        }
        fetch('/signin',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"red lighten-2"})
            }else{
                localStorage.setItem('jwt', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html: data.message, classes:"green lighten-2"})
                history.push('/')
            }
            
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="signin-card">
            <div className="card signin-box input-field">
                <h1>Instagram</h1>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button onClick={()=>userAuth()} className="btn waves-effect waves-light light-blue darken-4" >
                    Signin
                </button>
                <h5><Link to="/signup">Don't have an account ?</Link></h5>
                <h6><Link to="/reset-password">Forgot Password ?</Link></h6>
            </div>
        </div>
    )
}

export default Signin
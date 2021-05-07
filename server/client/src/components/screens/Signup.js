import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const postUser = () => {
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Email is not valid!", classes:"blue lighten-2"})
            return
        }
        fetch('/signup', {
            method: "post",
            headers: {
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({
                name:name,
                email:email,
                password:password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"red lighten-2"})
            }else{
                M.toast({html: data.message, classes:"green lighten-2"})
                history.push('/signin')
            }
        })
        .catch(err=>console.log(err))

    }

    return(
        <div className="signin-card">
            <div className="card signin-box input-field">
                <h1>Instagram</h1>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <input
                    type="email"
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
                <button onClick={()=>postUser()} className="btn waves-effect waves-light light-blue darken-4" >
                    Signup
                </button>
                <h5><Link to="/signin">Already have an account ?</Link></h5>
            </div>
        </div>
    )
}

export default Signup
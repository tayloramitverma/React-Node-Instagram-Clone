import React,{ useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'

const UpdatePassword = () => {
    const history = useHistory()
    const [password, setPassword] = useState('')
    const {token} = useParams()
    const userAuth = () => {
        fetch('/updatepassword',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password:password,
                token:token
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
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="signin-card">
            <div className="card signin-box input-field">
                <h1>Instagram</h1>
                <input
                    type="password"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button onClick={()=>userAuth()} className="btn waves-effect waves-light light-blue darken-4" >
                    Update Password
                </button>
            </div>
        </div>
    )
}

export default UpdatePassword
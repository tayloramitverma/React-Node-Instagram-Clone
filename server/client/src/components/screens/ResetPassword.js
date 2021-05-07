import React,{ useState} from 'react'
import M from 'materialize-css'

const ResetPassword = () => {
    const [email, setEmail] = useState('')

    const userAuth = () => {
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Email is not valid!", classes:"blue lighten-2"})
            return
        }
        fetch('/resetpassword',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"red lighten-2"})
            }else{
                M.toast({html: data.message, classes:"green lighten-2"})
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
                <button onClick={()=>userAuth()} className="btn waves-effect waves-light light-blue darken-4" >
                    Reset Password
                </button>
            </div>
        </div>
    )
}

export default ResetPassword
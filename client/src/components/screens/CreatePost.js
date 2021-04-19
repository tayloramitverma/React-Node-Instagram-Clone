import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')

    const postImage = () => {
        const data = new FormData();
        data.append("file", image)
        data.append("upload_preset", "instagram-clone")
        data.append("cloud_name", "beingidea123")

        fetch("https://api.cloudinary.com/v1_1/beingidea123/image/upload", {
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            postDetails(data.url)
        })
        .catch(err=>console.log(err))
    }

    const postDetails = (url) => {

        fetch('http://localhost:5000/createpost',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                photo:url,
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"red lighten-2"})
            }else{
                localStorage.setItem('mySecretKey', data.token)
                M.toast({html: data.message, classes:"green lighten-2"})
                history.push('/')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className="card input-field">
            <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
            <input type="text" value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Body" />
            <div className="file-field input-field">
                <div className="btn light-blue darken-4">
                    <span>Upload Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button onClick={()=>postImage()} className="btn waves-effect waves-light light-blue darken-4" >
                Submit Post
            </button>

        </div>
    )
}

export default CreatePost
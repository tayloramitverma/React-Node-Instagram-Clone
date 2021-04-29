import React, {useState} from 'react'
import M from 'materialize-css'

const UpdateProfile = () => {

    const {name,bio,photo} = JSON.parse(localStorage.getItem("user"))

    const [fullname, setFullname] = useState(name)
    const [about, setAbout] = useState(bio?bio:'')
    const [image, setImage] = useState('')

    const postImage = () => {
        if(image){
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
        }else{
            postDetails()
        }
        
    }

    const postDetails = (url=photo) => {

        fetch('http://localhost:5000/update-profile',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                name:fullname,
                bio: about,
                photo:url,
            })
        })
        .then(res=>res.json())
        .then(data=>{

            if(data.error){
                M.toast({html: data.error, classes:"red lighten-2"})
            }else{
                localStorage.setItem("user", JSON.stringify(data.result))
                M.toast({html: data.message, classes:"green lighten-2"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className="card input-field">
            <input type="text" value={fullname} onChange={(e)=>setFullname(e.target.value)} placeholder="Name" />
            <input type="text" value={about} onChange={(e)=>setAbout(e.target.value)} placeholder="Bio" />
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
                Update
            </button>

        </div>
    )
}

export default UpdateProfile
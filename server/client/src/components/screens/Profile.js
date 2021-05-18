import React,{useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
const defaultImg = require('../../assets/img/user-placeholder.png');

const Profile = () => {
    
    const [user, setUser] = useState('')
    const [pic, setPic] = useState(defaultImg.default)
    const [posts, setPosts] = useState('')

    useEffect(()=>{
        fetch('/api/user/'+JSON.parse(localStorage.getItem("user"))._id,{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){

            }else{
                setUser(data.user)
                setPosts(data.posts)
                if(data.user.photo){
                    setPic(data.user.photo)
                }
            }
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    return(
        <div className="profile-card">
            <div style={{display:'flex',justifyContent:'space-around',margin:'18px, 0px',borderBottom:'1px solid grey'}}>
                <div className="profile-image">
                    <img 
                        alt={user?user.name:""}
                        style={{width:'160px',height:'160px',borderRadius:'50%'}}
                        src={pic}
                    />
                    <Link to="/update-profile" className="edit-profile" >
                        <i className="material-icons">forum</i>
                    </Link>
                </div>
                <div>
                    <h2>{user?user.name:"Loading..."}</h2>
                    <p>{user?user.bio:""}</p>
                    <div style={{display:'flex',justifyContent:'space-between',width:"108%"}}>
                        <h6>{posts?posts.length : 0} Posts</h6>
                        <h6>{user?user.follower.length:0} Follower</h6>
                        <h6>{user?user.following.length:0} Following</h6>
                    </div>
                </div>
            </div>

            <div className="gallery">
            {
                posts && posts.length>0 && (
                    posts.map((item, index)=>{
                        return (
                            <img
                                key={index}
                                alt={item.title} 
                                className="item"
                                src={item.photo}
                            />
                        )
                    })
                )
            }
            </div>
        </div>
    )
}

export default Profile
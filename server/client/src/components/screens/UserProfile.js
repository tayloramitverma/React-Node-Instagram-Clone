import React,{useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import M from 'materialize-css'
const defaultImg = require('../../assets/img/user-placeholder.png');
const UserProfile = () => {

    const activeUser = JSON.parse(localStorage.getItem("user"))
    const [user, setUser] = useState('')
    const [posts, setPosts] = useState([])
    const [pic, setPic] = useState(defaultImg.default)
    const {userid} = useParams()

    useEffect(()=>{
        fetch('/api/user/'+userid,{
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
    },[userid])

    const followUser = () => {
        fetch('/api/follow/',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"red lighten-2"})
            }
            setUser(data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const unfollowUser = () => {
        fetch('/api/unfollow/',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"red lighten-2"})
            }
            setUser(data)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    
    return(
        <div className="profile-card">
            <div style={{display:'flex',justifyContent:'space-around',margin:'18px, 0px',borderBottom:'1px solid grey',padding: '6px 0px'}}>
                <div>
                    <img 
                        alt={user?user.name:""}
                        style={{width:'160px',height:'160px',borderRadius:'50%'}}
                        src={pic}
                    />
                </div>
                <div>
                    <h2>{user?user.name:'Loading...'}</h2>
                    <p>{user?user.bio:""}</p>
                    <div style={{display:'flex',justifyContent:'space-between',width:"108%"}}>
                        <h6>{posts.length} Posts</h6>
                        <h6>{user?user.follower.length:0} Follower</h6>
                        <h6>{user?user.following.length:0} Following</h6>
                    </div>
                    { (userid !== activeUser._id) && 
                    <> 
                        { (user && !user.follower.includes(activeUser._id)) ?
                        <button onClick={()=>followUser()} className="btn waves-effect waves-light light-blue darken-4" >
                            Follow
                        </button>
                        :
                        <button onClick={()=>unfollowUser()} className="btn waves-effect waves-light light-blue darken-4" >
                            unFollow
                        </button>
                        }
                    </>
                    }
                </div>
            </div>

            <div className="gallery">
            {
                posts.length>0 && (
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

export default UserProfile
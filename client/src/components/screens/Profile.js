import React,{useState, useEffect,useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {

    const [posts, setPosts] = useState([])
    const [allposts, setAllPosts] = useState(0)

    const {state} = useContext(UserContext)

    useEffect(()=>{
        fetch('http://localhost:5000/userposts',{
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){

            }else{
                setPosts(data.posts)
                setAllPosts(data.posts.length)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    return(
        <div className="profile-card">
            <div style={{display:'flex',justifyContent:'space-around',margin:'18px, 0px',borderBottom:'1px solid grey'}}>
                <div>
                    <img 
                        alt="" 
                        style={{width:'160px',height:'160px',borderRadius:'50%'}}
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80"
                    />
                </div>
                <div>
                    <h2>{state?state.name:"Loading..."}</h2>
                    <div style={{display:'flex',justifyContent:'space-around'}}>
                        <h6>{allposts} Posts</h6>
                        <h6>34 Follower</h6>
                        <h6>12 Following</h6>
                    </div>
                </div>
            </div>

            <div className="gallery">
            {
                allposts>0 && (
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
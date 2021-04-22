import React, {useState, useEffect, useContext} from 'react'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Home = () => {
    const [posts, setPosts] = useState([])
    const {state} = useContext(UserContext)

    useEffect(()=>{
        fetch('http://localhost:5000/posts',{
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
            }
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    const likePost = (id) => {
        fetch('http://localhost:5000/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(res=>{
            
            const newData = posts.map(item=>{
                if(item._id === res.result._id){
                    return res.result
                }else{
                    return item
                }
            })
            setPosts(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch('http://localhost:5000/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        })
        .then(res=>res.json())
        .then(res=>{
            
            const newData = posts.map(item=>{
                if(item._id === res.result._id){
                    return res.result
                }else{
                    return item
                }
            })
            setPosts(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    
    const commentPost = (text, id) => {
        fetch('http://localhost:5000/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                text:text,
                postId:id
            })
        })
        .then(res=>res.json())
        .then(res=>{
            
            const newData = posts.map(item=>{
                if(item._id === res.result._id){
                    return res.result
                }else{
                    return item
                }
            })
            setPosts(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (id) => {
        fetch(`http://localhost:5000/delete/${id}`,{
            method:"delete",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(res=>{
            const newData = posts.filter(item=>{
                return item._id !== id
            })
            setPosts(newData)

            M.toast({html: res.message, classes:"green lighten-2"})
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return(
        <div>
            {
                posts.length>0 && (
                    posts.map((item, index)=>{
                        return (
                            <div key={index} className="card home-card">
                                <h5 className="posted-name">
                                    {item.postedBy.name} 
                                    {item.postedBy._id.toString() === state._id.toString() &&
                                        <i 
                                            className="material-icons delete-post" 
                                            onClick={()=>deletePost(item._id)}
                                        >
                                            delete
                                        </i>
                                    }
                                </h5>
                                <div className="card-image">
                                    <img 
                                        alt={item.title}
                                        src={item.photo}
                                    />
                                </div>
                                <div className="card-content">
                                    {
                                        item.likes.includes(state._id) ?
                                        <i
                                            className="material-icons" 
                                            onClick={()=>unlikePost(item._id)}
                                            style={{color:'red'}}
                                        >
                                            favorite
                                        </i>
                                        :
                                        <i
                                            className="material-icons" 
                                            onClick={()=>likePost(item._id)}
                                        >
                                            favorite
                                        </i>
                                    }  
                                    <p>Likes {item.likes.length}</p>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    {
                                        item.comments.length > 0 && 
                                        <>
                                            {
                                                item.comments.map((comment, index)=>{
                                                    return (
                                                        <h6 key={index}>
                                                            <span style={{fontWeight:'500'}}>{comment.postedBy.name.toLowerCase()} </span>
                                                            <span>{comment.text}</span>
                                                        </h6>
                                                    )
                                                })
                                            }
                                        </>
                                    }
                                    <form onSubmit={(e)=>{
                                        e.preventDefault()
                                        commentPost(e.target[0].value, item._id)
                                    }}>
                                        <input
                                            type="text"
                                            placeholder="comment"
                                        />
                                    </form>
                                </div>
                            </div>
                        )
                    })
                )
            }
        </div>
    )
}

export default Home
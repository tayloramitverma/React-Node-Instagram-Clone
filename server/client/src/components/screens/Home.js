import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
const defaultImg = require("../../assets/img/user-placeholder.png");

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch("/posts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
        } else {
          setPosts(data.posts);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const newData = posts.map((item) => {
          if (item._id === res.result._id) {
            return res.result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const newData = posts.map((item) => {
          if (item._id === res.result._id) {
            return res.result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const commentPost = (text, id) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const newData = posts.map((item) => {
          if (item._id === res.result._id) {
            return res.result;
          } else {
            return item;
          }
        });
        setPosts(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (id) => {
    fetch(`/delete/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const newData = posts.filter((item) => {
          return item._id !== id;
        });
        setPosts(newData);

        M.toast({ html: res.message, classes: "green lighten-2" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {posts &&
        posts.map((item, index) => {
          return (
            <div key={index} className="card home-card">
              <h5 className="posted-name">
                {item.postedBy.photo ? (
                  <img
                    alt={item.postedBy.name}
                    src={item.postedBy.photo}
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <img
                    alt={item.postedBy.name}
                    src={defaultImg.default}
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                    }}
                  />
                )}
                <Link to={"/profile/" + item.postedBy._id}>
                  {item.postedBy.name}{" "}
                </Link>
              </h5>
              {item.postedBy._id.toString() === state._id.toString() && (
                <i
                  className="material-icons delete-post right"
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
              <div className="card-image">
                <img alt={item.title} src={item.photo} />
              </div>
              <div className="card-content">
                {item.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    onClick={() => unlikePost(item._id)}
                    style={{ color: "red" }}
                  >
                    favorite
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    onClick={() => likePost(item._id)}
                  >
                    favorite
                  </i>
                )}
                <p>Likes {item.likes.length}</p>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.length > 0 && (
                  <>
                    {item.comments.map((comment, index) => {
                      return (
                        <h6 key={index}>
                          <span style={{ fontWeight: "500" }}>
                            {comment.postedBy.name.toLowerCase()}{" "}
                          </span>
                          <span>{comment.text}</span>
                        </h6>
                      );
                    })}
                  </>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    commentPost(e.target[0].value, item._id);
                    e.target[0].value = "";
                  }}
                >
                  <input type="text" placeholder="comment" />
                </form>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Home;

import {
  Avatar,
  Card,
  Checkbox,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Delete, Edit, Favorite, FavoriteBorder } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { AuthContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  commentCard: {
    marginBottom: theme.spacing(0.5),
    position: "relative",
  },
}));

function Comment({ post, comment, newCom }) {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState({});

  const [like, setLike] = useState(comment.likes.length);

  const [isLiked, setIsLiked] = useState(false);

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sinzi.herokuapp.com/api/users?userId=${comment.userId}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [comment.userId]);

  useEffect(() => {
    setIsLiked(comment.likes.includes(currentUser._id));
  }, [currentUser._id, comment.likes]);

  const likeHandler = () => {
    try {
      axios.put("https://sinzi.herokuapp.com/api/comments/" + comment._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`https://sinzi.herokuapp.com/api/comments/${comment._id}`, {
        data: { userId: currentUser._id, postId: post._id },
      });
    } catch (err) {
      console.log(err);
    }
    newCom();
  };

  return (
    <div>
      <Card className={classes.commentCard}>
        <div
          style={{
            marginLeft: "12px",
            marginRight: "12px",
            marginBottom: "12px",
            marginTop: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              marginBottom: "-1px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Avatar
                  alt={user.username}
                  src={PF + user.profilePicture}
                  style={{ width: "20px", height: "20px" }}
                />
                <Typography style={{ fontWeight: "bold", marginLeft: "4px" }}>
                  {user.username}{" "}
                  {/* <div style={{ width: "40%", overflow: "hidden" }}> */}
                  <span style={{ fontSize: "14px", fontWeight: "lighter"}}>
                    {comment.desc}
                  </span>{" "}
                  {/* </div> */}
                  {user._id === currentUser._id && (
                    <>
                      <IconButton aria-label="edit">
                        <Edit
                          color="primary"
                          style={{
                            width: "14px",
                            height: "14px",
                          }}
                        />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={deleteHandler}>
                        <Delete
                          style={{
                            width: "14px",
                            height: "14px",
                            color: "black",
                          }}
                        />
                      </IconButton>
                    </>
                  )}
                </Typography>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div>
                {like > 0 && (
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#d32f2f",
                    }}
                  >
                    {" "}
                    {like}
                  </Typography>
                )}
              </div>
              <div>
                {isLiked && (
                  <Checkbox
                    icon={
                      <Favorite
                        style={{
                          width: "14px",
                          height: "14px",
                          color: "#d50000",
                        }}
                      />
                    }
                    onClick={likeHandler}
                  />
                )}
                {!isLiked && (
                  <Checkbox
                    icon={
                      <FavoriteBorder
                        style={{ width: "14px", height: "14px" }}
                      />
                    }
                    onClick={likeHandler}
                  />
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "2px" }}>
            <Typography
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                right: 4,
                position: "absolute",
                bottom: 2,
                color: "gray",
                marginTop: "4px",
              }}
            >
              {format(comment.createdAt)}
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Comment;

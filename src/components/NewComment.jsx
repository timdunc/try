import {
  Avatar,
  Checkbox,
  Chip,
  IconButton,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Delete, Edit, Favorite, FavoriteBorder } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useReducer } from "react";
import { useHistory } from "react-router-dom";
import { format } from "timeago.js";
import { AuthContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  userName: {
    margin: theme.spacing(1),
    fontWeight: "bold",
  },
  commentDesc: {
    margin: theme.spacing(1),
    marginTop: "-5px",
    fontWeight: "bold",
  },
  commentDesc1: {
    margin: theme.spacing(1),
  },
}));

const NewComment = ({ post, comment, newCom, forceUpdate }) => {
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
  }, [currentUser._id, comment.likes, newCom]);

  const likeHandler = () => {
    try {
      axios.put(
        "https://sinzi.herokuapp.com/api/comments/" + comment._id + "/like",
        {
          userId: currentUser._id,
        }
      );
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deleteHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(
        `https://sinzi.herokuapp.com/api/comments/${comment._id}`,
        {
          data: { userId: currentUser._id, postId: post._id },
        }
      );
    } catch (err) {
      console.log(err);
    }
    forceUpdate();
  };

  const history = useHistory();

  const handleProf = () => {
    history.push(`/profile/${user.username}`);
  };

  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
      style={{ marginBottom: "4px" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip
          avatar={<Avatar alt={user.username} src={PF + user.profilePicture} />}
          label={user.username}
          variant="outlined"
          className={classes.userName}
          onClick={handleProf}
        />
        <div
          className={classes.commentDesc1}
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
                  <FavoriteBorder style={{ width: "14px", height: "14px" }} />
                }
                onClick={likeHandler}
              />
            )}
          </div>
        </div>
      </div>
      <Typography className={classes.commentDesc} paragraph>
        {comment.desc}
      </Typography>
      <div
        className={classes.commentDesc}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "-10px",
        }}
      >
        {user._id === currentUser._id ? (
          <div>
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
          </div>
        ) : (
          <div className={classes.commentDesc}></div>
        )}
        <Typography
          variant="caption"
          display="block"
          gutterBottom
          style={{fontWeight: "bold"}}
        >
          {format(post.createdAt)}
        </Typography>
      </div>
    </Paper>
  );
};

export default NewComment;

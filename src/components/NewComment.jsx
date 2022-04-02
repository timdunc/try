import {
  Avatar,
  Checkbox,
  Chip,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useReducer } from "react";
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

const NewComment = ({ post, comment }) => {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState({});

  const [like, setLike] = useState(comment.likes.length);

  const [isLiked, setIsLiked] = useState(false);

  const { user: currentUser } = useContext(AuthContext);

  const [newCom, forceUpdate] = useReducer((x) => x + 1 || x - 1, 0);

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
    forceUpdate();
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
    </Paper>
  );
};

export default NewComment;

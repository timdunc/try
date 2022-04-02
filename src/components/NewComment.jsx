import { Avatar, Chip, makeStyles, Paper, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { AuthContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  userName: {
    margin: theme.spacing(1),
  },
  commentDesc: {
    margin: theme.spacing(1),
    marginTop: 0,
  },
}));

const NewComment = ({ post, comment, newCom }) => {
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
      <Chip
        avatar={<Avatar alt={user.username} src={PF + user.profilePicture} />}
        label={user.username}
        variant="outlined"
        className={classes.userName}
      />
      <Typography className={classes.commentDesc} paragraph>
        {comment.desc}
      </Typography>
    </Paper>
  );
};

export default NewComment;

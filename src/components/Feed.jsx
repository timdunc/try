import { Container, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import NewPost from "./NewPost";
import NewSuggestedUsers from "./NewSuggestedUsers";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    [theme.breakpoints.down("md")]: {
      paddingTop: theme.spacing(7),
      paddingBottom: theme.spacing(7),
      width: "100%",
      paddingRight: 0,
      paddingLeft: 0,
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(7),
    },
  },
}));

const Feed = ({ username, socket, socketUser, newCom }) => {
  const classes = useStyles();

  const { user: currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(
            "https://sinzi.herokuapp.com/api/posts/profile/" + username
          )
        : await axios.get(
            "https://sinzi.herokuapp.com/api/posts/timeline/" + currentUser._id
          );
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, currentUser._id, newCom]);

  const post1 = posts.at(0);

  return (
    <>
      <Container className={classes.container}>
        {posts.map((p, index) => (
          <React.Fragment key={p._id}>
            <NewPost post={p} socket={socket} socketUser={socketUser} />
            <>
              {p === post1 ? (
                // <NewSuggestedUsers username={username} />
                <p>Hello There</p>
              ) : null}
            </>
          </React.Fragment>
        ))}
      </Container>
    </>
  );
};

export default Feed;

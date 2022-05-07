import { Container, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import NewPost from "./NewPost";
import SuggestedUsers from "./SuggestedUsers";
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

const Feed = ({ username, socket, socketUser, newCom, forceUpdate }) => {
  const classes = useStyles();

  const { user: currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);

  const [firstPost, setFirstPost] = useState({});

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

  // useEffect(() => {
  //   setFirstPost(posts?.at(0));
  // }, [posts]);

  return (
    <>
      <Container className={classes.container}>
        {posts.map((p, index) => (
          <React.Fragment key={p._id}>
            <NewPost post={p} socket={socket} socketUser={socketUser} forceUpdate={forceUpdate} />
            {/* {p === firstPost ? (
              // <SuggestedUsers username={username} />
              <div>
                <span>Hello There</span>
              </div>
            ) : (<div></div>)} */}
          </React.Fragment>
        ))}
      </Container>
    </>
  );
};

export default Feed;

import { Container, makeStyles } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import SuggestedUsers from "./SuggestedUsers";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(9),
      paddingBottom: theme.spacing(4),
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
        ? await axios.get("https://sinzi.herokuapp.com/api/posts/profile/" + username)
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

  return (
    <>
      <Container className={classes.container}>
        {posts.map((p) => (
          <>
            <Post
              key={p.img}
              post={p}
              socket={socket}
              socketUser={socketUser}
            />
            {/* {p === posts.at(0) ? (
              <SuggestedUsers key={currentUser._id} username={username} />
            ) : null} */}
          </>
        ))}
      </Container>
    </>
  );
};

export default Feed;

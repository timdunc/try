import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  makeStyles,
  Slide,
  Snackbar,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { styled } from "@material-ui/styles";
import { motion } from "framer-motion";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingTop: theme.spacing(10),
    display: "flex",
    marginBottom: "-60px",
  },
  userContainer: {
    marginLeft: "24px",
    marginRight: "10px",
    position: "relative",
    zIndex: 1,
  },
  userStory: {
    opacity: 0.8,
  },
  addStory: {
    color: "white",
    top: 80,
    left: 24,
    position: "absolute",
  },
  userAvatar: {
    top: 6,
    left: 6,
    position: "absolute",
    border: "3px solid white",
  },
  othersContainer: {
    overflowX: "hidden",
    marginRight: "20px",
    borderRadius: "5px",
  },
  allOthersPost: {
    marginRight: "24px",
    display: "flex",
    borderRadius: "5px",
  },
  othersPost: {
    position: "relative",
    marginRight: "10px",
    cursor: "grab",
  },
  media: {
    height: "280px",
    objectFit: "cover",
    width: "199px",
  },
}));

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const SingleUserCard = ({ followings, forceUpdate }) => {
  const classes = useStyles();

  const [openMessage, setOpenMessage] = React.useState(false);

  const [transition, setTransition] = React.useState(undefined);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState({});

  const { user: currentUser, dispatch } = useContext(AuthContext);

  const [followed, setFollowed] = useState(
    currentUser?.followings.includes(user?._id)
  );

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sinzi.herokuapp.com/api/users?userId=${followings}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [followings, forceUpdate]);

  useEffect(() => {
    setFollowed(currentUser?.followings.includes(user?._id));
    forceUpdate();
  }, [currentUser, user._id, forceUpdate]);

  const handleClick = (Transition) => async (e) => {
    e.preventDefault();
    try {
      if (followed) {
        await axios.put(
          "https://sinzi.herokuapp.com/api/users/" + user._id + "/unfollow",
          { userId: currentUser._id }
        );
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(
          "https://sinzi.herokuapp.com/api/users/" + user._id + "/follow",
          { userId: currentUser._id }
        );
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (err) {
      console.log(err);
    }
    setFollowed(!followed);
    forceUpdate();
    setTransition(() => Transition);
    setOpenMessage(true);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  return (
    <>
      {currentUser !== user._id && !followed && (
        <>
          {currentUser._id !== user._id && (
            <>
              <motion.div
                style={{
                  marginRight: "8px",
                  marginBottom: "3px",
                  display: "flex",
                }}
              >
                <Card>
                  <CardActionArea>
                    <Link
                      to={`/profile/${user.username}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Avatar
                        title={user.username}
                        src={PF + user.profilePicture}
                        className={classes.userAvatar}
                      />
                    </Link>
                    <CardMedia
                      className={classes.media}
                      image={
                        user.profilePicture
                          ? PF + user.profilePicture
                          : PF + undefined
                      }
                      title={user.username}
                    />
                    <CardActions>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                          <Typography
                            size="small"
                            style={{ fontWeight: "bold", marginTop: "2px" }}
                          >
                            {user.username}
                          </Typography>
                          {currentUser !== user._id && followed ? (
                            <Button
                              variant="contained"
                              size="small"
                              color="secondary"
                              onClick={handleClick}
                            >
                              UNFOLLOW
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              onClick={handleClick(TransitionRight)}
                            >
                              FOLLOW
                            </Button>
                          )}
                      </div>
                    </CardActions>
                  </CardActionArea>
                </Card>
              </motion.div>
            </>
          )}
        </>
      )}
      <Snackbar
        open={openMessage}
        autoHideDuration={5000}
        onClose={handleCloseMessage}
        TransitionComponent={transition}
        message={"You followed " + user.username}
        key={transition ? transition.name : ""}
      />
    </>
  );
};

export default SingleUserCard;

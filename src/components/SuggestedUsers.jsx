import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Container,
  IconButton,
  makeStyles,
  Typography,
  Modal,
  Slide,
  Snackbar,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useReducer,
} from "react";
import { useParams } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { styled } from "@material-ui/styles";
import { Link } from "react-router-dom";
import { Cancel, PhotoCamera } from "@material-ui/icons";
import FriendStory from "./FriendStory";
import UserCard from "./UserCard";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { useTheme } from "@material-ui/styles";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingTop: theme.spacing(0.5),
    display: "flex",
    marginBottom: "10px",
    marginTop: "-10px",
    [theme.breakpoints.down("md")]: {
      width: "98%",
      marginLeft: "3.7px",
      // marginRight: 0,
      // overflow: "scroll",
    },
  },
  userContainer: {
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
    borderRadius: "5px",
  },
  allOthersPost: {
    marginRight: "24px",
    display: "flex",
    borderRadius: "5px",
  },
  othersPost: {
    display: "flex",
    position: "relative",
    cursor: "grab",
  },
  media: {
    height: 180,
    objectFit: "cover",
    width: "110px",
  },
  container: {
    width: 500,
    height: 550,
    backgroundColor: "white",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    borderRadius: "5px",
    [theme.breakpoints.down("md")]: {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    },
    overflow: "auto",
  },
  form: {
    padding: theme.spacing(2),
  },
  item: {
    marginBottom: theme.spacing(3),
    marginTop: "40px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const SuggestedUsers = ({ username }) => {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser } = useContext(AuthContext);

  const [user, setUser] = useState({});

  const [friends, setFriends] = useState([]);

  const [followed, setFollowed] = useState(
    currentUser?.followings.includes(user?._id)
  );
  const [followers, setFollowers] = useState(user?.followers);

  const [followings, setFollowings] = useState(user.followings?.length);

  const [following, setFollowing] = useState({});

  const othersContainer = useRef();

  const [width, setWidth] = useState(0);

  const [newWid, forceUpdate] = useReducer((x) => x + 1 || x - 1, 0);

  const test = friends?.map((f) => f.followings);

  const allFollowingz = [].concat(...test);

  const unique = [
    ...allFollowingz?.filter((value, index) => {
      return allFollowingz?.indexOf(value) === index;
    }),
  ];

  const newFriends = friends.map((f) => f._id);

  const allFriends = [].concat(...unique, ...newFriends);

  const uniqueFollowings = [
    ...allFriends?.filter((value, index) => {
        return allFriends?.indexOf(value) === index;
    }),
  ];

  // console.log(uniqueFollowings);

  // const [newFollowings, setNewFollowings] = useState([]);

  // console.log(friendsFollowings)

  // console.log(width)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sinzi.herokuapp.com/api/users?username=${currentUser.username}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [currentUser.username]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          "https://sinzi.herokuapp.com/api/users/friends/" + currentUser._id
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log("");
      }
    };
    getFriends();
  }, [currentUser._id]);

  useEffect(() => {
    setFollowings(user?.followings);
  }, [user.followings]);

  useEffect(() => {
    setFollowers(user?.followers);
  }, [user.followers]);

  useEffect(() => {
    setWidth(
      othersContainer.current.scrollWidth -
        7 -
        othersContainer.current.offsetWidth
    );
  }, [othersContainer, newWid, width]);

  // console.log(unique)

  return (
    <>
      <div
        style={{ fontWeight: "bold", marginBottom: "10px", marginTop: "-10px",marginLeft: "10px", marginRight: "10px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Typography style={{ fontWeight: "bold" }}>
              Suggested for You
            </Typography>
          </div>
          <div>
            <Typography
              style={{ fontWeight: "bold", fontSize: "16px" }}
              color="secondary"
            >
              View All
            </Typography>
          </div>
        </div>
      </div>
      <motion.div className={classes.mainContainer}>
        <motion.div
          ref={othersContainer}
          whileTap={{ cursor: "grabbing" }}
          className={classes.othersContainer}
          style={{ width: "100%" }}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 1, left: -width }}
            className={classes.allOthersPost}
            style={{ width: "100%" }}
          >
            <motion.div
              className={classes.othersPost}
              style={{ display: "flex" }}
            >
              {uniqueFollowings?.map((friend) => (
                <React.Fragment key={friend}>
                      <UserCard
                        key={friend}
                        friend={friend}
                        forceUpdate={forceUpdate}
                        friends={uniqueFollowings}
                      />
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default SuggestedUsers;

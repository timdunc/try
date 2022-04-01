import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
    marginBottom: "-8px",
  },
  inline: {
    display: "inline",
  },
  margin: {
    margin: theme.spacing(1),
  },
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  container: {
    marginTop: "65px",
    height: "625px",
  },
  messageArea: {
    marginTop: "65px",
    paddingLeft: 24,
    paddingRight: 24,
  },
  cardMessage: {
    width: "100%",
  },
  conversations: {
    height: "77%",
  },
  title: {
    marginBottom: "-4px",
  },
}));

const Conversation = ({ conversation, onlineUsers }) => {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser } = useContext(AuthContext);

  const [user, setUser] = useState({});

  const socket = useRef();

  const [friends, setFriends] = useState([]);

  const [onlineFriends, setOnlineFriends] = useState([]);

  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(
        "https://sinzi.herokuapp.com/api/users/friends/" + currentUser._id
      );
      setFriends(res.data);
    };
    getFriends();
  }, [currentUser]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  //setting socket and getting new messages
  // useEffect(() => {
  //   socket.current = io("ws://localhost:5000");
  //   socket.current.on("getMessage", (data) => {
  //     setArrivalMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       createdAt: Date.now(),
  //     });
  //   });
  // }, []);

  //getting ftiends ID in Conversations
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(
          "https://sinzi.herokuapp.com/api/users?userId=" + friendId
        );
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  const active = onlineUsers
    .filter((o) => o === user._id)
    .map((u) => u.length > 0);

  return (
    <div style={{ marginLeft: "-20px" }}>
      <List className={classes.root} component="nav">
        <ListItem alignItems="flex-start" button>
          <ListItemAvatar>
            <Avatar
              alt={user.username}
              src={PF + user.profilePicture}
              style={{ marginTop: "-4px" }}
            />
          </ListItemAvatar>
          <ListItemText
            secondary={
              <React.Fragment>
                {active.length === 1 ? (
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {user.username}
                    <div style={{ color: "#2e7d32" }}>online ●</div>
                  </Typography>
                ) : (
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {user.username}
                    <div style={{ color: "#999999" }}>offline ●</div>
                  </Typography>
                )}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </List>
    </div>
  );
};

export default Conversation;

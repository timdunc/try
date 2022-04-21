import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  createTheme,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  makeStyles,
  TextField,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import Add from "../components/Add";
import Navbar from "../components/Navbar";
import Rightbar from "../components/Rightbar";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";

//   import { io } from "socket.io-client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Message from "../components/Message";
import Conversation from "../components/Conversation";
import { ArrowBackIosRounded, MoreVert, Send } from "@material-ui/icons";
import axios from "axios";

import BottomNav from "../components/BottomNav";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "36ch",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  margin: {
    margin: theme.spacing(2),
  },
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  container: {
    marginTop: "50px",
    height: "100vh",
  },
  messageArea: {
    marginTop: "50px",
    paddingLeft: 0,
    paddingRight: 0,
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

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a00000",
    },
  },
});

const Messenger = ({ own }) => {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);

  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [user, setUser] = useState({});

  const scrollRef = useRef();

  const socket = useRef();

  const [friends, setFriends] = useState([]);

  const [onlineFriends, setOnlineFriends] = useState([]);

  const [activeUsers, setActiveUsers] = useState([]);

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

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  //adding users to socket and getting onlineUsers
  //getting online users
  // useEffect(() => {
  //   socket.current.emit("addUser", currentUser._id);
  //   socket.current.on("getUsers", (users) => {
  //     setOnlineUsers(
  //       currentUser.followings.filter((f) => users.some((u) => u.userId === f))
  //     );
  //   });
  // }, [currentUser]);

  // getting Conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          "https://sinzi.herokuapp.com/api/conversations/" + currentUser._id
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser._id]);

  //getting messages using current chat ID
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          "https://sinzi.herokuapp.com/api/messages/" + currentChat?._id
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  //Sending messages
  const handleSumit = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== currentUser._id
    );

    // socket.current.emit("sendMessage", {
    //   senderId: currentUser._id,
    //   receiverId,
    //   text: newMessage,
    // });

    try {
      const res = await axios.post(
        "https://sinzi.herokuapp.com/api/messages",
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  //Scroll Effect for new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //getting ftiends ID in Conversations
  useEffect(() => {
    const friendId = currentChat?.members.find(
      (member) => member !== currentUser._id
    );

    const getUser = async () => {
      try {
        const res = friendId
          ? await axios(
              "https://sinzi.herokuapp.com/api/users?userId=" + friendId
            )
          : await axios(
              "https://sinzi.herokuapp.com/api/users?userId=" + currentUser._id
            );
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser._id, currentChat]);

  const active = onlineUsers
    .filter((o) => o === user._id)
    .map((u) => u.length > 0);

  // console.log(active);

  return (
    <>
        <ThemeProvider theme={darkTheme}>
          <Navbar />
          <Grid style={{ width: "100vw" }} container>
            <Grid item sm={12} xs={12} style={{ width: "100%" }}>
              {currentChat ? (
                <>
                  <div className={classes.messageArea}>
                    <Card
                      className={classes.cardMessage}
                      style={{ width: "100vw" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            onClick={() => setCurrentChat(null)}
                            aria-label="Back"
                            style={{
                              marginTop: "20px",
                            }}
                          >
                            <ArrowBackIosRounded
                              style={{
                                // marginRight: "-20px",
                                fontWeight: "bold",
                              }}
                            />
                          </IconButton>
                          <CardHeader
                            avatar={
                              <Avatar
                                src={PF + user.profilePicture}
                                className={classes.avatar}
                              />
                            }
                            title={user.username}
                            subheader={
                              active.length === 1 ? (
                                <div style={{ color: "#2e7d32" }}>online ●</div>
                              ) : (
                                "offline"
                              )
                            }
                            style={{ marginTop: "20px" }}
                          />
                        </div>
                        <IconButton
                          aria-label="settings"
                          style={{
                            marginTop: "20px",
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </div>
                      <div
                        style={{
                          marginTop: "-10px",
                          height: "530px",
                          marginBottom: "-30px",
                          overflow: "scroll",
                          overflowX: "hidden",
                          width: "100%",
                        }}
                      >
                        <CardContent
                          style={{
                            marginTop: "-25px",
                            // height: "70%",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                          }}
                        >
                          {messages.map((m) => (
                            <div key={m._id} ref={scrollRef} style={{ marginBottom: "-10px" }}>
                              <Message
                                key={m._id}
                                message={m}
                                own={m.sender === currentUser._id}
                              />
                            </div>
                          ))}
                        </CardContent>
                      </div>
                    </Card>
                    <Card
                      style={{
                        marginTop: "3px",
                        display: "flex",
                        width: "100vw",
                      }}
                    >
                      <div style={{ width: "90%", marginRight: "15px" }}>
                        <Input
                          onChange={(e) => setNewMessage(e.target.value)}
                          value={newMessage}
                          placeholder="Write something..."
                          inputProps={{ "aria-label": "description" }}
                          style={{
                            marginTop: "5px",
                            marginBottom: "5px",
                            marginLeft: "10px",
                            width: "100%",
                          }}
                        />
                      </div>
                      <div>
                        <Button
                          onClick={handleSumit}
                          variant="contained"
                          color="primary"
                          label="Send"
                          className={classes.button}
                          endIcon={<Send />}
                          size="small"
                          style={{
                            backgroundColor: "#212121",
                            marginRight: "10px",
                            marginTop: "6px",
                          }}
                        >
                          Send
                        </Button>
                      </div>
                    </Card>
                  </div>
                </>
              ) : (
                <Grid item sm={12} xs={12}>
                  <div className={classes.conversations}>
                    <Card className={classes.container}>
                      <div style={{ marginTop: "5px" }}>
                        <form noValidate autoComplete="off">
                          <TextField
                            className={classes.margin}
                            id="input-with-icon-textfield"
                            label="Search for friends..."
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SupervisedUserCircleIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </form>
                      </div>
                      <CardContent>
                        {conversations.map((c) => (
                          <div key={c._id} onClick={() => setCurrentChat(c)}>
                            <Conversation
                              key={c._id}
                              conversation={c}
                              onlineUsers={onlineUsers}
                            />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </Grid>
              )}
            </Grid>
            {/* <Grid item sm={0} className={classes.right}>
              <Rightbar
                onlineUsers={onlineUsers}
                currentUser={currentUser._id}
                setCurrentChat={setCurrentChat}
              />
            </Grid> */}
          </Grid>
          <BottomNav />
        </ThemeProvider>
    </>
  );
};

export default Messenger;
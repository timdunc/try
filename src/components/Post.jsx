import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Collapse,
  IconButton,
  Input,
  InputBase,
  makeStyles,
  Slide,
  Snackbar,
  styled,
  Typography,
  Modal,
  Container,
} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import {
  Favorite,
  FavoriteBorder,
  Send,
  ArrowBackIosRounded,
} from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ShareIcon from "@material-ui/icons/Share";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Comment from "./Comment";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// import { io } from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
    },
  },
  container: {
    [theme.breakpoints.down("sm")]: {
      marginBottom: "28px",
    },
  },
  cardModal: {
    [theme.breakpoints.down("md")]: {
      width: "100vw",
      height: "100%",
    },
  },
  media: {
    minHeight: 400,
    [theme.breakpoints.down("sm")]: {
      minHeight: 400,
    },
  },
  userInfo: {
    marginTop: theme.spacing(-0.5),
    fontSize: "13px",
  },
  expand: {
    color: theme.palette.primary.main,
  },
  cardActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContent: {
    marginTop: theme.spacing(-5),
  },
  cardContentElement: {
    alignItems: "center",
  },
  contentNameTypo: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  cardActionsComment: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing(-2),
    marginBottom: theme.spacing(-4),
    // [theme.breakpoints.down("md")]: {
    //   width: "100vw",
    // },
  },
  commentInput: {
    marginLeft: "12px",
    [theme.breakpoints.down("md")]: {
      // width: "100%",
    },
  },
  contentAvatar: {
    width: "28px",
    height: "28px",
  },
}));

const Expand = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const Post = ({ post }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [openMessage, setOpenMessage] = React.useState(false);

  const [transition, setTransition] = React.useState(undefined);

  const [like, setLike] = useState(post.likes.length);

  const [isLiked, setIsLiked] = useState(false);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleBackExpandClick = () => {
    setExpanded(!expanded);
    setOpen(false);
  };

  const [user, setUser] = useState({});

  const { user: currentUser } = useContext(AuthContext);

  const [comments, setComments] = useState([]);

  const [desc, setDesc] = useState("");

  const [onlineUsers, setOnlineUsers] = useState([]);

  const socket = useRef();

  const [newCom, forceUpdate] = useReducer((x) => x + 1 || x - 1, 0);

  // useEffect(() => {
  //   socket.current = io("ws://localhost:5000");
  // }, []);

  // useEffect(() => {
  //   socket.current.emit("addUser", currentUser._id);
  //   socket.current.on("getUsers", (users) => {
  //     setOnlineUsers(
  //       currentUser.followings.filter((f) => users.some((u) => u.userId === f))
  //     );
  //   });
  // }, [currentUser]);

  useEffect(() => {
    const fetchComment = async () => {
      const res = await axios.get(
        "https://sinzi.herokuapp.com/api/comments/posts/" + post._id
      );
      setComments(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    setDesc("");
    fetchComment();
  }, [post, newCom]);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sinzi.herokuapp.com/api/users?userId=${post.userId}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = (type) => {
    try {
      axios.put("https://sinzi.herokuapp.com/api/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
      // socket.current.emit("sendNotification", {
      //   senderId: currentUser.username,
      //   receiverId: user._id,
      //   type,
      // });
    } catch (err) {
      console.log(err);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleClick = (Transition, type) => async (e) => {
    e.preventDefault();

    const newComment = {
      userId: currentUser._id,
      postId: post._id,
      desc: desc,
    };

    if (desc !== "") {
      try {
        await axios.post(
          "https://sinzi.herokuapp.com/api/comments/",
          newComment
        );
        socket.current.emit("sendNotification", {
          senderId: currentUser.username,
          receiverId: user._id,
          type,
        });
        // window.location.reload();
        forceUpdate();
        setTransition(() => Transition);
        setOpenMessage(true);
        setOpen(false);
        setDesc("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClickSingle = (Transition, type) => async (e) => {
    e.preventDefault();

    const newComment = {
      userId: currentUser._id,
      postId: post._id,
      desc: desc,
    };

    if (desc !== "") {
      try {
        await axios.post(
          "https://sinzi.herokuapp.com/api/comments/",
          newComment
        );
        // socket.current.emit("sendNotification", {
        //   senderId: currentUser.username,
        //   receiverId: user._id,
        //   type,
        // });
        forceUpdate();
        setTransition(() => Transition);
        setOpenMessage(true);
        setDesc("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const lastComments = [].concat(
    comments.at(0),
    comments.at(1),
    comments.at(2)
  );

  return (
    <>
      <Card className={classes.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            // marginTop: "-12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardHeader
              avatar={
                <Link to={`/profile/${user.username}`}>
                  <Avatar alt="" src={PF + user.profilePicture} />
                </Link>
              }
            />
            <div style={{ marginLeft: "-28px" }}>
              <Typography style={{ fontWeight: "bold" }}>
                {user.username}
              </Typography>
              <Typography className={classes.userInfo}>
                {format(post.createdAt)}
              </Typography>
            </div>
          </div>
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        </div>
        {post.img && (
          <>
            <div
            // style={{
            //   position: "relative",
            //   display: "flex",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   alignContent: "center",
            //   width: "100%",
            // }}
            >
              {/* <center> */}
              <CardMedia
                className={classes.media}
                image={PF + post.img}
                title={post.desc}
                // style={{width: "10%", height: "10%"}}
              />
              {/* <img
                  className={classes.media}
                  src={PF + post.img}
                  alt={post.desc}
                  // style={{width: "10%", height: "10%"}}
                /> */}
              {/* </center> */}
            </div>
          </>
        )}
        <CardActions className={classes.cardActions}>
          <CardActions>
            {isLiked && (
              <Checkbox
                icon={<Favorite style={{ color: "#b71c1c" }} />}
                onClick={likeHandler}
              />
            )}
            {!isLiked && (
              <Checkbox
                icon={<FavoriteBorder />}
                onClick={() => likeHandler(1)}
              />
            )}
            {like > 0 && like === 1 && (
              <Typography
                variant="body1"
                color="secondary"
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#c62828",
                }}
              >
                {" "}
                {like} Like
              </Typography>
            )}
            {like > 1 && (
              <Typography
                variant="body1"
                color="secondary"
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#c62828",
                }}
              >
                {" "}
                {like} Likes
              </Typography>
            )}

            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </CardActions>
        <CardContent className={classes.cardContent}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className={classes.cardContentElement}>
              <Typography variant="body2" className={classes.contentNameTypo}>
                {user.username}{" "}
                <span style={{ fontWeight: "lighter", fontSize: "14px" }}>
                  {post.desc}
                </span>
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ marginLeft: "10px" }}>
                {comments.length === 0 && (
                  <Typography style={{ fontWeight: "bold", fontSize: "14px" }}>
                    No Comments yet
                  </Typography>
                )}
                {comments.length === 1 && (
                  <Typography style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {comments.length} Comment
                  </Typography>
                )}
                {comments.length > 1 && (
                  <Typography style={{ fontWeight: "bold", fontSize: "14px" }}>
                    {comments.length} Comments
                  </Typography>
                )}
              </div>
              <div>
                <Expand
                  expand={expanded}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                  style={{}}
                  className={classes.expand}
                >
                  <ExpandMoreIcon />
                </Expand>
              </div>
            </div>
          </div>
          <CardActions className={classes.cardActionsComment}>
            <CardActions></CardActions>
          </CardActions>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex" }}>
                <Avatar
                  alt={currentUser.username}
                  src={PF + currentUser.profilePicture}
                  className={classes.contentAvatar}
                />
                <form
                  className={classes.form}
                  autoComplete="off"
                  onSubmit={handleClick(TransitionRight, 2)}
                >
                  <InputBase
                    className={classes.commentInput}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Leave a comment"
                    inputProps={{ "aria-label": "Leave a comment" }}
                    onChange={(e) => setDesc(e.target.value)}
                    style={{ width: "50vw" }}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    style={{ marginTop: "-4px" }}
                    aria-label="send"
                  >
                    {/* <div onClick={handleClear}> */}
                    <Send
                      style={{ marginTop: "-4px", transform: "rotate(-45deg)" }}
                    />
                    {/* </div> */}
                  </IconButton>
                </form>
              </div>
              {comments.length >= 4 && (
                <div>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                    color="secondary"
                    onClick={() => setOpen(true)}
                  >
                    See All
                  </Typography>
                </div>
              )}
            </div>
            {comments.length <= 3 && (
              <>
                {comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    post={post}
                    comment={comment}
                    newCom={forceUpdate}
                  />
                ))}
              </>
            )}
            {comments.length >= 4 && (
              <>
                {lastComments.map((comment) => (
                  <Comment
                    key={comment._id}
                    post={post}
                    comment={comment}
                    newCom={forceUpdate}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Collapse>
      </Card>
      <Modal open={open} style={{ overflow: "scroll" }}>
        <div style={{ position: "relative" }}>
          <Container
            className={classes.container}
            style={{ backgroundColor: "white" }}
          >
            <Card className={classes.cardModal}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton onClick={handleBackExpandClick} aria-label="Back">
                    <ArrowBackIosRounded
                      style={{
                        marginRight: "-20px",
                        marginLeft: "0px",
                        fontWeight: "bold",
                      }}
                    />
                  </IconButton>
                  <CardHeader
                    avatar={
                      <Link to={`/profile/${user.username}`}>
                        <Avatar alt="" src={PF + user.profilePicture} />
                      </Link>
                    }
                  />
                  <div style={{ marginLeft: "-28px" }}>
                    <Typography style={{ fontWeight: "bold" }}>
                      {user.username}
                    </Typography>
                    <Typography className={classes.userInfo}>
                      {format(post.createdAt)}
                    </Typography>
                  </div>
                </div>
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              </div>
              {post.img && (
                <>
                  <div
                  // style={{
                  //   position: "relative",
                  //   display: "flex",
                  //   justifyContent: "center",
                  //   alignItems: "center",
                  //   alignContent: "center",
                  //   width: "100%",
                  // }}
                  >
                    {/* <center> */}
                    <CardMedia
                      className={classes.media}
                      image={PF + post.img}
                      title={post.desc}
                      // style={{width: "10%", height: "10%"}}
                    />
                    {/* <img
                  className={classes.media}
                  src={PF + post.img}
                  alt={post.desc}
                  // style={{width: "10%", height: "10%"}}
                /> */}
                    {/* </center> */}
                  </div>
                </>
              )}
              <CardActions className={classes.cardActions}>
                <CardActions>
                  {isLiked && (
                    <Checkbox
                      icon={<Favorite style={{ color: "#b71c1c" }} />}
                      onClick={likeHandler}
                    />
                  )}
                  {!isLiked && (
                    <Checkbox
                      icon={<FavoriteBorder />}
                      onClick={() => likeHandler(1)}
                    />
                  )}
                  {like > 0 && like === 1 && (
                    <Typography
                      variant="body1"
                      color="secondary"
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#c62828",
                      }}
                    >
                      {" "}
                      {like} Like
                    </Typography>
                  )}
                  {like > 1 && (
                    <Typography
                      variant="body1"
                      color="secondary"
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#c62828",
                      }}
                    >
                      {" "}
                      {like} Likes
                    </Typography>
                  )}

                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </CardActions>
              </CardActions>
              <CardContent className={classes.cardContent}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className={classes.cardContentElement}>
                    <Typography
                      variant="body2"
                      className={classes.contentNameTypo}
                    >
                      {user.username}{" "}
                      <span style={{ fontWeight: "lighter", fontSize: "14px" }}>
                        {post.desc}
                      </span>
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ marginLeft: "10px" }}>
                      {comments.length === 0 && (
                        <Typography
                          style={{ fontWeight: "bold", fontSize: "14px" }}
                        >
                          No Comments yet
                        </Typography>
                      )}
                      {comments.length === 1 && (
                        <Typography
                          style={{ fontWeight: "bold", fontSize: "14px" }}
                        >
                          {comments.length} Comment
                        </Typography>
                      )}
                      {comments.length > 1 && (
                        <Typography
                          style={{ fontWeight: "bold", fontSize: "14px" }}
                        >
                          All {comments.length} Comments
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>
                <CardActions className={classes.cardActionsComment}>
                  <CardActions></CardActions>
                </CardActions>
              </CardContent>
              <CardContent>
                <>
                  {comments.map((comment, index) => (
                    <Comment
                      key={index}
                      post={post}
                      comment={comment}
                      newCom={forceUpdate}
                    />
                  ))}
                </>
              </CardContent>
            </Card>
            <div
              style={{
                position: "fixed",
                left: 0,
                bottom: 0,
                backgroundColor: "white",
                width: "100vw",
              }}
            >
              <form
                className={classes.form}
                autoComplete="off"
                onSubmit={handleClickSingle(TransitionRight, 2)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    // width: "100%",
                    padding: "0 10px",
                    // flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // outline: "2px solid grey",
                    }}
                  >
                    <Avatar
                      alt={currentUser.username}
                      src={PF + currentUser.profilePicture}
                      className={classes.contentAvatar}
                    />
                    <InputBase
                      className={classes.commentInput}
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Leave a comment"
                      inputProps={{ "aria-label": "Leave a comment" }}
                      onChange={(e) => setDesc(e.target.value)}
                      style={{}}
                    />
                  </div>
                  <div>
                    <IconButton type="submit" aria-label="send">
                      <Send
                        style={{
                          transform: "rotate(-45deg)",
                        }}
                      />
                    </IconButton>
                  </div>
                </div>
              </form>
            </div>
          </Container>
        </div>
      </Modal>
      <Snackbar
        open={openMessage}
        onClose={handleCloseMessage}
        autoHideDuration={2000}
        TransitionComponent={transition}
        message="Comment added"
        key={transition ? transition.name : ""}
      />
    </>
  );
};

export default Post;

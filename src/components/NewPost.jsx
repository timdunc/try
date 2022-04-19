import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Collapse,
  Container,
  IconButton,
  InputBase,
  Link,
  makeStyles,
  Modal,
  Slide,
  Snackbar,
  styled,
  TextField,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import {
  ArrowBackIosRounded,
  ExpandMoreRounded,
  Favorite,
  FavoriteBorder,
  MoreVert,
  MoreVertRounded,
  Send,
  Share,
  ShareRounded,
} from "@material-ui/icons";
import * as React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { format } from "timeago.js";
import { useReducer } from "react";
import NewComment from "./NewComment";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      paddingRight: 0,
      paddingLeft: 0,
      height: "100vh",
    },
  },
  media: {
    // minHeight: 400,
    // objectFit: "contain",
    [theme.breakpoints.down("md")]: {
      //   objectFit: "cover",
      //   minHeight: 400,
      maxHeight: "600px",
      objectFit: "cover",
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

const NewPost = ({ post }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const [openMessage, setOpenMessage] = React.useState(false);

  const [transition, setTransition] = React.useState(undefined);

  const [user, setUser] = useState({});

  const { user: currentUser } = useContext(AuthContext);

  const [like, setLike] = useState(post.likes.length);

  const [isLiked, setIsLiked] = useState(false);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [comments, setComments] = useState([]);

  const [desc, setDesc] = useState("");

  const [newCom, forceUpdate] = useReducer((x) => x + 1 || x - 1, 0);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    forceUpdate();
  };

  const handleBackExpandClick = () => {
    setOpen(false);
  };

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

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sinzi.herokuapp.com/api/users?userId=${post.userId}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  const history = useHistory();

  const handleProf = () => {
    history.push(`/profile/${user.username}`);
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

  return (
    <>
      <Card sx={{  }} style={{ marginBottom: "10px", marginLeft: "8.5px", width: "100%"}}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "-12px",
            marginBottom: "-6px",
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
              avatar={<Avatar alt="" src={PF + user.profilePicture} />}
              onClick={handleProf}
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
            <MoreVertRounded />
          </IconButton>
        </div>
        <CardMedia
          component="img"
          // height="194"
          image={PF + post.img}
          alt={post.desc}
          className={classes.media}
          style={{ marginBottom: "-5px" }}
          onClick={() => setOpen(true)}
        />
        <CardActions className={classes.cardActions} style={{ height: "30px" }}>
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
              <ShareRounded />
            </IconButton>
          </CardActions>
        </CardActions>
        <CardContent className={classes.cardContent} style={{ height: "40px" }}>
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
                  <Typography
                    style={{ fontWeight: "bold", fontSize: "14px" }}
                    onClick={handleExpandClick}
                  >
                    No Comments yet
                  </Typography>
                )}
                {comments.length === 1 && (
                  <Typography
                    style={{ fontWeight: "bold", fontSize: "14px" }}
                    onClick={handleExpandClick}
                  >
                    {comments.length} Comment
                  </Typography>
                )}
                {comments.length > 1 && (
                  <Typography
                    style={{ fontWeight: "bold", fontSize: "14px" }}
                    onClick={handleExpandClick}
                  >
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
                  <ExpandMoreRounded />
                </Expand>
              </div>
            </div>
          </div>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <div style={{ marginBottom: "-10px" }}>
              {comments.map((comment) => (
                <NewComment
                  key={comment._id}
                  post={post}
                  comment={comment}
                  newCom={newCom}
                  forceUpdate={forceUpdate}
                />
              ))}
            </div>
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
                  marginTop: "-12px",
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
                        // marginRight: "-20px",
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
                  <MoreVert />
                </IconButton>
              </div>
              {post.img && (
                <>
                  <CardMedia
                    component="img"
                    // height="194"
                    image={PF + post.img}
                    alt={post.desc}
                    className={classes.media}
                    style={{ marginBottom: "-5px", marginTop: "-10px" }}
                    onClick={() => setOpen(true)}
                  />
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
                    <Share />
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
              <CardContent style={{marginBottom: "25px"}}>
                <>
                  {comments.map((comment) => (
                    <NewComment
                      key={comment._id}
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
                width: "100%",
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

export default NewPost;

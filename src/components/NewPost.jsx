import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Collapse,
  IconButton,
  InputBase,
  Link,
  makeStyles,
  Slide,
  styled,
  Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import {
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
import Comment from "./Comment";

const useStyles = makeStyles((theme) => ({
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

const NewPost = ({ post }) => {
  const classes = useStyles();

  const [user, setUser] = useState({});

  const { user: currentUser } = useContext(AuthContext);

  const [like, setLike] = useState(post.likes.length);

  const [isLiked, setIsLiked] = useState(false);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleBackExpandClick = () => {
    setExpanded(!expanded);
    // setOpen(false);
  };

  const [comments, setComments] = useState([]);

  const [desc, setDesc] = useState("");

  const [newCom, forceUpdate] = useReducer((x) => x + 1 || x - 1, 0);

  const [open, setOpen] = useState(false);

  const [transition, setTransition] = useState(undefined);

  const [openMessage, setOpenMessage] = useState(false);

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
        // socket.current.emit("sendNotification", {
        //   senderId: currentUser.username,
        //   receiverId: user._id,
        //   type,
        // });
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
      <Card sx={{ maxWidth: 345 }} style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "-12px",
            marginBottom: "-12px",
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
            <MoreVertRounded />
          </IconButton>
        </div>
        <CardMedia
          component="img"
          height="194"
          image={PF + post.img}
          alt={post.desc}
          className={classes.media}
        />
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
              <ShareRounded />
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
    </>
  );
};

export default NewPost;

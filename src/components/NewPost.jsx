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
  Link,
  makeStyles,
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
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron
              and set aside for 10 minutes.
            </Typography>
            <Typography paragraph>
              Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet
              over medium-high heat. Add chicken, shrimp and chorizo, and cook,
              stirring occasionally until lightly browned, 6 to 8 minutes.
              Transfer shrimp to a large plate and set aside, leaving chicken
              and chorizo in the pan. Add pimentón, bay leaves, garlic,
              tomatoes, onion, salt and pepper, and cook, stirring often until
              thickened and fragrant, about 10 minutes. Add saffron broth and
              remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Typography paragraph>
              Add rice and stir very gently to distribute. Top with artichokes
              and peppers, and cook without stirring, until most of the liquid
              is absorbed, 15 to 18 minutes. Reduce heat to medium-low, add
              reserved shrimp and mussels, tucking them down into the rice, and
              cook again without stirring, until mussels have opened and rice is
              just tender, 5 to 7 minutes more. (Discard any mussels that don’t
              open.)
            </Typography>
            <Typography>
              Set aside off of the heat to let rest for 10 minutes, and then
              serve.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
};

export default NewPost;

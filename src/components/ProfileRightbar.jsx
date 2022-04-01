import {
  Container,
  makeStyles,
  Typography,
  CardActions,
  Button,
  CardContent,
  CardMedia,
  Card,
  Avatar,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    top: 0,
    [theme.breakpoints.down("md")]: {
      paddingTop: theme.spacing(7),
      width: "100%",
      paddingRight: 0,
    },
  },
  profileAvatar: {
    width: "96px",
    height: "96px",
    border: "3px solid white",
  },
  profileAvatarSet: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "-70px",
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: "#555",
  },
  link: {
    marginRight: theme.spacing(2),
    color: "#555",
    fontSize: 16,
  },
  profileEdit: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const ProfileRightbar = ({ username }) => {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState({});

  const [friends, setFriends] = useState([]);

  const { user: currentUser, dispatch } = useContext(AuthContext);

  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );

  const [followers, setFollowers] = useState(user.followers?.length);

  const [followings, setFollowings] = useState(user.followings?.length);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sinzi.herokuapp.com/api/users?username=${username}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(
          "https://sinzi.herokuapp.com/api/users/friends/" + user?._id
        );
        setFriends(friendList.data);
      } catch (err) {
        console.log("");
      }
    };
    getFriends();
  }, [user._id]);

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user._id]);

  useEffect(() => {
    setFollowings(user.followings?.length);
  }, [user.followings]);

  useEffect(() => {
    setFollowers(user.followers?.length);
  }, [user.followers]);

  const handleClick = async () => {
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
    setFollowings(user.followings?.length);
    setFollowers(user.followers?.length);
  };

  return (
    <Container className={classes.container}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={user.coverPicture ? PF + user.coverPicture : PF + undefined}
          alt={user.username + "'s cover picture"}
        />
        <div className={classes.profileAvatarSet}>
          <div></div>
          <div>
            <Avatar
              alt={user.username}
              src={PF + user.profilePicture}
              className={classes.profileAvatar}
            />
          </div>
          <div></div>
        </div>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            style={{ fontWeight: "bold", textAlign: "center" }}
          >
            {user.username}
          </Typography>
          <div
            style={{
              backgroundColor: "#eeeeee",
              borderRadius: "15px",
              textColor: "#212121",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      marginTop: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      {followers}
                    </Typography>
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      Followers
                    </Typography>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "center",
                      marginTop: "15px",
                      marginBottom: "10px",
                    }}
                  >
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      {followings}
                    </Typography>
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      Following
                    </Typography>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                {currentUser._id !== user._id && followed && (
                  <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={handleClick}
                  >
                    UNFOLLOW
                  </Button>
                )}
                {currentUser._id !== user._id && !followed && (
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={handleClick}
                  >
                    FOLLOW
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="body2" style={{ fontWeight: "bold" }}>
                Category:
              </Typography>
              <Typography variant="body2" style={{ marginLeft: "10px" }}>
                Artist and Actor
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography variant="body2" style={{ fontWeight: "bold" }}>
                Bio:
              </Typography>
              <Typography variant="body2" style={{ marginLeft: "10px" }}>
                Business Man
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography variant="body2" style={{ fontWeight: "bold" }}>
                Website:
              </Typography>
              <Typography variant="body2" style={{ marginLeft: "10px" }}>
                www.frex.com
              </Typography>
            </div>
          </div>
        </CardContent>
        <div style={{ width: "100%" }}>
          <CardActions className={classes.profileEdit}>
            <div style={{marginLeft: "7px"}}>
              {
                user._id !== currentUser._id &&
              (<Button size="small" color="primary" variant="contained" endIcon={<SendIcon />}>
                Message
              </Button>)
              }
            </div>
            <div>
              {
                user._id === currentUser._id &&
              (<Button size="small" color="primary">
                <EditIcon />
              </Button>)
              }
            </div>
          </CardActions>
        </div>
        <div style={{ marginLeft: "20px" }}>
          {currentUser.username === user.username && (
            <Typography className={classes.title} gutterBottom>
              People you follow
            </Typography>
          )}
          {currentUser.username !== user.username && (
            <Typography className={classes.title} gutterBottom>
              People {user.username} Follows
            </Typography>
          )}

          <AvatarGroup max={5} style={{ marginBottom: 20 }}>
            {friends?.map((friend) => (
              <Link
                key={friend._id}
                to={"/profile/" + friend.username}
                style={{ textDecoration: "none", border: "none" }}
              >
                <Avatar
                  key={friend._id}
                  alt={friend?.username}
                  src={PF + friend?.profilePicture}
                  title={friend.username}
                  style={{ border: "2px solid white" }}
                />
              </Link>
            ))}
          </AvatarGroup>
        </div>
      </Card>
    </Container>
  );
};

export default ProfileRightbar;

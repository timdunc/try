import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  makeStyles,
  Slide,
  Snackbar,
  Button,
  Card,
  CardActionArea,
  Container,
  IconButton,
  Input,
  Modal,
  TextField,
} from "@material-ui/core";
import {
  AddCircleOutlineRounded,
  Favorite,
  Home,
  LocationOn,
  Restore,
  Cancel,
  PhotoCamera,
} from "@material-ui/icons";
import { useEffect } from "react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  BottomNav: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  container: {
    width: 500,
    height: 550,
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      height: "100vh",
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

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const BottomNav = ({ forceUpdate }) => {
  const [open, setOpen] = useState(false);

  const classes = useStyles({ open });

  const [value, setValue] = useState(0);

  const history = useHistory();

  const [openMessage, setOpenMessage] = useState(false);
  const [transition, setTransition] = useState(undefined);

  const { user } = useContext(AuthContext);

  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);

  const handleClick = (Transition) => async (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      desc: desc,
    };

    if (file) {
      const data = new FormData();

      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);

      newPost.img = fileName;

      try {
        await axios.post("https://sinzi.herokuapp.com/api/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("https://sinzi.herokuapp.com/api/posts", newPost);
      setTransition(() => Transition);
      forceUpdate();
      setOpenMessage(true);
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };
  
  const handleHome = () => {
    history.push("/");
    setValue(0);
  };

  const handleCloseAdd = () => {
    setOpen(false);
    history.push("/");
    setValue(0);
  };

  // useEffect(
  //   (e) => {
  //     if (value === 0) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //     if (value === 1) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //     if (value === 2) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //     if (value === 3) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //     if (value === 4) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //   },
  //   [value, history]
  // );

  return (
    <>
      <Box
        sx={{ width: "100%" }}
        style={{ position: "fixed", left: 0, bottom: 0, width: "100%" }}
        className={classes.BottomNav}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Home" icon={<Home />} onClick={handleHome} />
          <BottomNavigationAction label="Recents" icon={<Restore />} />
          <BottomNavigationAction
            label="Add"
            icon={<AddCircleOutlineRounded fontSize="large" />}
            onClick={() => setOpen(true)}
          />
          <BottomNavigationAction label="Favorites" icon={<Favorite />} />
          <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
        </BottomNavigation>
      </Box>
      <Modal open={open} style={{ overflow: "scroll" }}>
        <Container
          className={classes.container}
          style={{ backgroundColor: "white" }}
        >
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={handleClick(TransitionRight)}
          >
            <div className={classes.item}>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                label={"What's on your mind " + user.username + "?"}
                size="small"
                style={{ width: "100%" }}
                id="file"
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div
              style={{
                marginTop: "-30px",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "-8px",
              }}
            >
              <div></div>
              <div>
                <label htmlFor="icon-button-file">
                  <Input
                    onChange={(e) => setFile(e.target.files[0])}
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    style={{ display: "none" }}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                </label>
              </div>
            </div>
            {file && (
              <div style={{ marginBottom: "15px" }}>
                <Card className={classes.CardImg}>
                  <CardActionArea>
                    <div>
                      <img
                        className={classes.media}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          position: "relative",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <Cancel
                      onClick={() => setFile(null)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        opacity: "0.7",
                      }}
                    />
                  </CardActionArea>
                </Card>
              </div>
            )}
            <div className={classes.buttons}>
              <Button variant="contained" color="primary" type="submit">
                Share
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCloseAdd}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Container>
      </Modal>
      <Snackbar
        open={openMessage}
        onClose={handleCloseMessage}
        autoHideDuration={2000}
        TransitionComponent={transition}
        message="Post added"
        key={transition ? transition.name : ""}
      />
    </>
  );
};

export default BottomNav;

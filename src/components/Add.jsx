import {
  Button,
  Card,
  CardActionArea,
  Container,
  Fab,
  IconButton,
  Input,
  makeStyles,
  Modal,
  Slide,
  Snackbar,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Add as AddIcon, Cancel, PhotoCamera } from "@material-ui/icons";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: theme.palette.text.primary,
    [theme.breakpoints.down("sm")]: {
      left: 20,
      border: "2px solid",
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "visible",
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

const Add = ({ forceUpdate }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [openMessage, setOpenMessage] = React.useState(false);
  const [transition, setTransition] = React.useState(undefined);

  const { user } = useContext(AuthContext);

  const [desc, setDesc] = useState("");
  const [file, setFile] = useState("");
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const formHandler = (e) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadFiles(file);
    setFile(file);
  };

  const uploadFiles = (file) => {
    //
    if (!file) return;
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL);
        });
      }
    );
  };

  const handleClick = (Transition) => async (e) => {
    e.preventDefault();

    uploadFiles(file);

    const newPost = {
      userId: user._id,
      desc: desc,
    };

    if (file) {
      const data = new FormData();

      const fileName = url;
      data.append("name", fileName);
      data.append("file", file);
      // data.append("file", url);
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

  return (
    <>
      <Tooltip title="Add" aria-label="add" onClick={() => setOpen(true)}>
        <Fab color="primary" className={classes.fab}>
          <AddIcon />
        </Fab>
      </Tooltip>
      <Modal open={open} style={{ overflow: "scroll" }}>
        <Container
          className={classes.container}
          style={{ backgroundColor: "white" }}
        >
          <form onSubmit={formHandler}>
            <input type="file" />
            <Button variant="contained" color="secondary" type="submit">
              Upload Image
            </Button>
          </form>
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
                    onChange={(e) => setFile(e.target[0].files[0])}
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
                onClick={() => setOpen(false)}
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

export default Add;

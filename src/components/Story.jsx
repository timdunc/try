import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Container,
  IconButton,
  makeStyles,
  Modal,
  Slide,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../context/AuthContext";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { motion } from "framer-motion";
import { styled } from "@material-ui/styles";
import { Link } from "react-router-dom";
import { Cancel, PhotoCamera, Visibility } from "@material-ui/icons";
import FriendStory from "./FriendStory";
import StoryImages from "./StoryImages";
import MobileStepper from "@material-ui/core/MobileStepper";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { useTheme } from "@material-ui/styles";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    paddingTop: theme.spacing(10),
    display: "flex",
    marginBottom: "-60px",
    [theme.breakpoints.down("sm")]: {
      width: "102.4vw",
      paddingRight: 0,
      padding: 0,
      marginTop: "55px",
      marginLeft: "5px",
      // marginRight: 0,
      // overflow: "scroll",
    },
  },
  userContainer: {
    marginLeft: "24px",
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
    marginRight: "20px",
    borderRadius: "5px",
    // [theme.breakpoints.down("md")]: {
    //   overflowX: "auto",
    //   // marginRight: 0,
    //   // overflow: "scroll",
    // },
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
    maxWidth: 500,
    maxHeight: 550,
    backgroundColor: "white",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    borderRadius: "5px",
    [theme.breakpoints.down("sm")]: {
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
  modelContainer: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "100%",
      borderRadius: 0,
    },
  },
}));

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const Story = ({ post }) => {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const [openMessage, setOpenMessage] = React.useState(false);

  const [transition, setTransition] = React.useState(undefined);

  const [desc, setDesc] = useState("");

  const [file, setFile] = useState(null);

  const [width, setWidth] = useState(0);

  const othersContainer = useRef();

  const [stories, setStories] = useState(null);

  const [story, setStory] = useState({});

  const [storyImages, setStoryImages] = useState(null);

  const Input = styled("input")({
    display: "none",
  });

  useEffect(() => {
    setWidth(
      othersContainer.current.scrollWidth -
        10 -
        othersContainer.current.offsetWidth
    );
  }, [othersContainer]);

  useEffect(() => {
    const fetchStories = async () => {
      const res = await axios.get(
        "https://sinzi.herokuapp.com/api/stories/profile/" + currentUser.username
      );
      setStories(res.data);
    };
    fetchStories();
  }, [currentUser.username]);

  useEffect(() => {
    stories?.map((s) => setStory(s));
  }, [stories]);

  const lastStory = stories?.at(-1);

  // console.log(lastStory);

  // console.log(stories);

  // console.log(story.userId);
  // console.log(currentUser._id);

  const handleOpenModel = async () => {
    const newStory = {
      userId: currentUser._id,
    };

    if (story.userId === currentUser._id) {
      setOpen(true);
    } else {
      try {
        await axios.post("https://sinzi.herokuapp.com/api/stories/", newStory);
      } catch (err) {
        console.log(err);
      }
      setOpen(true);
    }
  };

  const handleClick = (Transition) => async (e) => {
    e.preventDefault();

    const newPost = {
      userId: currentUser._id,
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
      window.location.reload();
      setTransition(() => Transition);
      setOpenMessage(true);
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   const fetchStoryImages = async () => {
  //     const res = await axios.get(
  //       "https://sinzi.herokuapp.com/api/stories/profile/" + story?._id
  //     );
  //     setStoryImages(res.data);
  //   };
  //   fetchStoryImages();
  // }, [story._id]);

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = stories?.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <motion.div className={classes.mainContainer}>
        <div className={classes.userContainer}>
          <Card>
            <div className={classes.userStory}>
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  borderRadius: "10px",
                  height: "15px",
                  backgroundColor: "black",
                  zIndex: 1,
                  left: "5px",
                  bottom: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "center",
                    right: "2px",
                    marginTop: "-1px",
                    left: "2px",
                  }}
                >
                  <div style={{ right: "18px" }}>
                    <Typography
                      style={{
                        color: "white",
                        fontSize: "12px",
                        marginLeft: "3px",
                        fontWeight: "bold",
                        marginRight: "2px",
                      }}
                    >
                      3212
                    </Typography>
                  </div>
                  <div style={{ right: "4px", left: "24px" }}>
                    <Visibility
                      style={{
                        color: "white",
                        width: "16px",
                        height: "16px",
                        marginRight: "2px",
                      }}
                    />
                  </div>
                </div>
              </div>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={
                    stories && story.img
                      ? PF + lastStory.img
                      : PF + currentUser.profilePicture
                  }
                  title={currentUser.username}
                  onClick={handleOpenModel}
                />
              </CardActionArea>
            </div>
            <div>
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  multiple
                  type="file"
                />
                {!story.img ? (
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="add"
                    onClick={handleOpenModel}
                    className={classes.addStory}
                  >
                    <AddCircleOutlineIcon
                      style={{ width: "50px", height: "50px" }}
                    />
                  </IconButton>
                ) : null}
              </label>
            </div>
            <Link
              to={`/profile/${currentUser.username}`}
              style={{ textDecoration: "none" }}
            >
              <Avatar
                title={currentUser.username}
                src={PF + currentUser.profilePicture}
                className={classes.userAvatar}
              />
            </Link>
          </Card>
        </div>
        <motion.div
          ref={othersContainer}
          whileTap={{ cursor: "grabbing" }}
          className={classes.othersContainer}
        >
          <motion.div
            drag="x"
            dragConstraints={{ right: 1, left: -width }}
            className={classes.allOthersPost}
          >
            <motion.div className={classes.othersPost}>
              <FriendStory />
              <FriendStory />
              <FriendStory />
              <FriendStory />
              <FriendStory />
              <FriendStory />
              <FriendStory />
              <FriendStory />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      <Modal
        open={open}
        className={classes.modelContainer}
        style={{
          overflow: "scroll",
          display: "flex",
          flexWrap: "wrap",
          marginBottom: "auto",
          alignContent: "center",
        }}
      >
        <>
          {story.userId === currentUser._id && story.img && (
            <Card
              className={classes.container}
              sx={{ flexGrow: 1 }}
              style={{
                flexWrap: "wrap",
                justifyContent: "center",
                alignContent: "center",
                height: "auto",
                width: "500px",
                marginBottom: "auto",
                position: "relative",
              }}
            >
              <AutoPlaySwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
              >
                {stories?.map((step, index) => (
                  <>
                    {Math.abs(activeStep - index) <= 2 ? (
                      <div key={step._id}>
                        <div style={{ position: "relative" }}>
                          <StoryImages
                            component="img"
                            sx={{
                              objectFit: "cover",
                              overflow: "hidden",
                              width: "100%",
                              height: "100%",
                            }}
                            image={step.img}
                            style={{
                              height: "auto",
                              width: "auto",
                            }}
                          />
                          <Cancel
                            onClick={() => setOpen(false)}
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              opacity: "0.7",
                              width: "28px",
                              height: "28px",
                              backgroundColor: "white",
                              border: "-5px solid white",
                              borderRadius: "50%",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </>
                ))}
              </AutoPlaySwipeableViews>
              <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                style={{ marginTop: "auto", marginBottom: "auto" }}
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                  >
                    Next
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                    Back
                  </Button>
                }
              />
            </Card>
          )}
          {story.userId === currentUser._id && !story.img && (
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
                    label={"What's on your mind " + story._id + "?"}
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
                  <div style={{ position: "relative", marginBottom: "15px" }}>
                    <Card className={classes.CardImg}>
                      <CardActionArea>
                        <img
                          className={classes.media}
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
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
          )}
        </>
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

export default Story;

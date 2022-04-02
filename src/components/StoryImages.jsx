import { Card, CardContent, CardMedia } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
    mainContainer: {
      paddingTop: theme.spacing(10),
      display: "flex",
      marginBottom: "-60px",
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
      width: 500,
      height: 550,
      backgroundColor: "white",
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: "auto",
      borderRadius: "5px",
      [theme.breakpoints.down("md")]: {
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
  }));

const StoryImages = ({image, storyImages}) => {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <>
      <Card style={{}}>
        <CardMedia
          key={image.id}
          component="img"
          image={PF + image}
          alt="green iguana"
          style={{height: "500px"}}
        />
      </Card>
    </>
  );
};

export default StoryImages;

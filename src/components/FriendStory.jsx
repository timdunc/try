import {
  Avatar,
  Card,
  CardActionArea,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { styled } from "@material-ui/styles";
import { motion } from "framer-motion";

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
    position: "relative",
    marginRight: "10px",
    cursor: "grab",
  },
  media: {
    height: 180,
    objectFit: "cover",
    width: "110px",
  },
}));

const FriendStory = () => {
  const classes = useStyles();

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user } = useContext(AuthContext);

  return (
    <div style={{ marginRight: "10px" }}>
      <Card>
        <CardActionArea>
          <Link
            to={`/profile/${user.username}`}
            style={{ textDecoration: "none" }}
          >
            <Avatar
              title={user.username}
              src={PF + user.profilePicture}
              className={classes.userAvatar}
            />
          </Link>
          <CardMedia
            className={classes.media}
            image={PF + user.profilePicture}
            title={user.username}
          />
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
              opacity: "0.8",
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
        </CardActionArea>
      </Card>
    </div>
  );
};

export default FriendStory;

import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { format } from "timeago.js";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 325,
    marginTop: "2px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  message: {
    display: "flex",
    flexDirection: "column",
  },
  own: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: "0px",
  },
  typo: {
    color: "white",
    display: "flex",
    justifyContent: "flex-end",
    position: "absolute",
    right: "10px",
    bottom: "5px",
    fontSize: "12px",
    marginTop: "5px",
  },
}));

const Message = ({ message, own }) => {
  const classes = useStyles();
  return (
    <div>
      <div className={own ? classes.own : classes.message}>
        <div className="" style={{ marginBottom: "5px" }}>
          <div style={{ width: "50%" }}>
            <Card
              className={classes.root}
              style={
                own
                  ? { backgroundColor: "#004d40" }
                  : { backgroundColor: "#263238" }
              }
            >
              <CardContent style={{ marginTop: "-10px" }}>
                <Typography
                  variant="body2"
                  component="p"
                  style={
                    own
                      ? { color: "#ffffff", marginBottom: "-25px" }
                      : { color: "#ffffff", marginBottom: "-25px" }
                  }
                >
                  {message.text}
                </Typography>
              </CardContent>
              <CardActions>
                <Typography className={classes.typo}>
                  {format(message.createdAt)}
                </Typography>
              </CardActions>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

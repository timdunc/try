import { createTheme, Grid, makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { ThemeProvider } from "@material-ui/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Add from "../components/Add";
import Feed from "../components/Feed";
import BottomNav from "../components/BottomNav";
import Leftbar from "../components/Leftbar";
import Navbar from "../components/Navbar";
import ProfileRightbar from "../components/ProfileRightbar";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  },
  container: {
    [theme.breakpoints.down("md")]: {
      overflow: "scroll",
    },
  },
  primary: {
    main: grey[50],
  },

  right: {
    position: "sticky",
    top: 0,
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  centerBar: {
    display: "block",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
    [theme.breakpoints.down("md")]: {
      width: "103vw",
      // marginLeft: "-67px",
      marginBottom: "-50px",
      // paddingRight: "-20px",
      // marginTop: "-30.9px",
      marginRight: 0,
      // overflow: "scroll",
    },
  },
  rightBar: {
    position: "sticky",
    top: 0,
  },
  centerFeed: {
    [theme.breakpoints.down("md")]: {
      width: "103vw",
      marginRight: 0,
      // marginLeft: "-66.5px",
      // marginBottom: "-71px",
      // marginBottom: "42px",
      // overflow: "scroll",
    },
  },
  center: {
    [theme.breakpoints.down("md")]: {
      width: "103.8vw",
      marginLeft: "-15px",
      // overflow: "scroll",
    },
  },
  left: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const Profile = () => {
  const classes = useStyles();

  const username = useParams().username;

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sinzi.herokuapp.com/api/users?username=${username}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <div className={classes.mainContainer}>
        <ThemeProvider theme={darkTheme}>
          <Navbar />
          <Grid container className={classes.container}>
            <Grid item md={2} lg={2} className={classes.left}>
              <Leftbar />
            </Grid>
            <Grid item sm={12} xs={12} md={7} lg={7} className={classes.center}>
              <div className={classes.centerBar}>
                <ProfileRightbar username={username} />
              </div>
              <div className={classes.centerFeed}>
                <Feed username={username} />
              </div>
            </Grid>
            <Grid item md={3} lg={3} className={classes.right}>
              <div className={classes.rightBar}>
                <ProfileRightbar username={username} />
              </div>
            </Grid>
          </Grid>
          <Add />
          <BottomNav />
        </ThemeProvider>
      </div>
    </>
  );
};

export default Profile;

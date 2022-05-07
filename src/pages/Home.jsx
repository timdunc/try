import { Grid, makeStyles } from "@material-ui/core";
import { useReducer } from "react";
import Add from "../components/Add";
import BottomNav from "../components/BottomNav";
import Feed from "../components/Feed";
import Leftbar from "../components/Leftbar";
import Navbar from "../components/Navbar";
import Rightbar from "../components/Rightbar";
import { AuthContext } from "../context/AuthContext";
import Story from "../components/Story";
import { useContext } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      padding: 0,
      overflowX: "hidden",
      overflowY: "hidden",
    },
  },
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  left: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  centerFeed: {
    [theme.breakpoints.down("md")]: {
      width: "103vw",
      marginRight: 0,
      marginTop: "5px",
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
}));

const Home = () => {
  const classes = useStyles();

  const [newCom, forceUpdate] = useReducer((x) => x + 1 || x - 1, 0);

  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Grid
        container
        className={classes.container}
        columnspacing={{ xs: 0, sm: 0, md: 0 }}
      >
        <Grid item md={2} lg={2} className={classes.left}>
          <Leftbar />
        </Grid>
        <Grid item sm={12} xs={12} md={7} lg={7} className={classes.center}>
          <div className={classes.centerFeed}>
            <Feed newCom={newCom} />
          </div>
        </Grid>
        <Grid item md={3} lg={3} className={classes.right}>
          <Rightbar currentUser={user._id} />
        </Grid>
      </Grid>
      <Add forceUpdate={forceUpdate} />
      <BottomNav forceUpdate={forceUpdate} />
    </>
  );
};

export default Home;
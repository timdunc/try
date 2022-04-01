import { Grid, makeStyles } from "@material-ui/core";
import { useReducer } from "react";
import Add from "../components/Add";
import BottomNav from "../components/BottomNav";
import Feed from "../components/Feed";
import Leftbar from "../components/Leftbar";
import Navbar from "../components/Navbar";
import Rightbar from "../components/Rightbar";
import { AuthContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      padding: 0,
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
  center: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const Home = () => {
  const classes = useStyles();

  const [newCom, forceUpdate] = useReducer((x) => x + 1 || x - 1, 0);

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
          <Feed newCom={newCom} />
        </Grid>
        <Grid item md={3} lg={3} className={classes.right}>
          <Rightbar />
        </Grid>
      </Grid>
      <Add />
      <BottomNav />
    </>
  );
};

export default Home;

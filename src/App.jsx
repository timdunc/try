import { Grid, makeStyles } from "@material-ui/core";
import Add from "./components/Add";
import Feed from "./components/Feed";
import Leftbar from "./components/Leftbar";
import Navbar from "./components/Navbar";
import Rightbar from "./components/Rightbar";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  right: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
      width: 0,
    },
  },
  left: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
      width: 0,
    },
  },
  center: {
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <div>
      <Navbar />
      <Grid container className={classes.container}>
        <Grid item sm={0} xs={0} lg={2} md={2} className={classes.left}>
          <Leftbar />
        </Grid>
        <Grid item sm={12} xs={12} lg={7} md={7} className={classes.center}>
          <Feed />
        </Grid>
        <Grid item sm={0} xs={0} lg={3} md={3} className={classes.right}>
          <Rightbar />
        </Grid>
      </Grid>
      <Add />
    </div>
  );
};

export default App;

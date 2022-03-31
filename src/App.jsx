import { Grid, makeStyles } from "@material-ui/core";
import Add from "./components/Add";
import BottomNav from "./components/BottomNav";
import Feed from "./components/Feed";
import Leftbar from "./components/Leftbar";
import Navbar from "./components/Navbar";
import Rightbar from "./components/Rightbar";

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
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

const App = () => {
  const classes = useStyles();
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        <Navbar />
      </div>
      <div>
        <Grid container className={classes.container}>
          <Grid item sm={0} xs={0} md={2} lg={2} className={classes.left}>
            <Leftbar />
          </Grid>
          <Grid
            item
            sm={12}
            xs={12}
            md={7}
            lg={7}
            padding="0px"
            className={classes.center}
          >
            <Feed />
          </Grid>
          <Grid item sm={0} xs={0} md={3} lg={3} className={classes.right}>
            <Rightbar />
          </Grid>
        </Grid>
        <Add />
      </div>
      <div>
        <BottomNav />
      </div>
    </div>
  );
};

export default App;

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  makeStyles,
} from "@material-ui/core";
import {
  AddCircleOutlineRounded,
  Favorite,
  Home,
  LocationOn,
  Restore,
} from "@material-ui/icons";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  BottomNav: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const BottomNav = () => {
  const [open, setOpen] = useState(false);

  const classes = useStyles({ open });

  const [value, setValue] = useState(0);

  const history = useHistory();

  // useEffect(
  //   (e) => {
  //     if (value === 0) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //     if (value === 1) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //     if (value === 2) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //     if (value === 3) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //     if (value === 4) {
  //       e.preventDefault();
  //       history.push("/login");
  //     }
  //   },
  //   [value, history]
  // );

  return (
    <Box
      sx={{ width: "100%" }}
      style={{ position: "fixed", left: 0, bottom: 0, width: "100%" }}
      className={classes.BottomNav}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Recents" icon={<Restore />} />
        <BottomNavigationAction
          label="Add"
          icon={<AddCircleOutlineRounded fontSize="large" />}
        />
        <BottomNavigationAction label="Favorites" icon={<Favorite />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOn />} />
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;

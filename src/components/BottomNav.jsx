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
import { useState } from "react";
// import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    BottomNav: {
        [theme.breakpoints.up("sm")]: {
            display: "none",
          },
    }
}));

const BottomNav = () => {
  const [open, setOpen] = useState(false);

  const classes = useStyles({ open });

  const [value, setValue] = useState(0);

  // const navigate = useNavigate();

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

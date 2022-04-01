import * as React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  main: {
    width: 340,
    height: 550,
    backgroundColor: "white",
    position: "absolute",
    marginTop: "80px",
    top: "70px",
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "90vw",
      height: "60vh",
    },
  },
  cardActionsReg: {
    justifyContent: "center",
  },
  cardActionsLog: {
    justifyContent: "center",
  },
}));

function Login() {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, isFetching, error, dispatch } = React.useContext(AuthContext);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall({email, password}, dispatch);
  };

  return (
    <div className={classes.main}>
      <form onSubmit={handleClick}>
      <Card sx={{ maxWidth: 300 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="140"
          image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" style={{fontWeight: "bold"}}>
            Login
          </Typography>
          <TextField
            id="standard-basic_email"
            label="Email"
            variant="standard"
            type="email"
            style={{width: "100%"}}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            id="standard-basic_password"
            label="Password"
            variant="standard"
            type="password"
            style={{width: "100%"}}
            minLength="6"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </CardContent>
        <CardActions className={classes.cardActionsReg}>
          <Button type="submit" variant="contained" size="small" color="secondary" style={{fontWeight: "bold"}}>
            {isFetching ? <CircularProgress color="inherit" size= {22} /> : "Login"}
          </Button>
        </CardActions>
        <CardActions className={classes.cardActionsLog}>
          <Typography>Don't have an account?</Typography>
          <Button href="/register" size="small" color="primary">
            Register
          </Button>
        </CardActions>
      </Card>
      </form>
    </div>
  );
}

export default Login;

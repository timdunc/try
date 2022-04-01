import * as React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router";
import axios from "axios";

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

function Register() {
  const classes = useStyles();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords don't match!");
    } else {
      const user = {
        username: username,
        email: email,
        password: password
      };
      try {
        await axios.post("https://sinzi.herokuapp.com/api/auth/register", user);
        history.push("/login");
      } catch (err) {
        console.log("err");
      };
    }
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
            Register
          </Typography>
          <TextField
            id="standard-basic1"
            label="Username"
            variant="standard"
            type="username"
            style={{width: "100%"}}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            id="standard-basic2"
            label="Email"
            variant="standard"
            type="email"
            style={{width: "100%"}}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            id="standard-basic3"
            label="Password"
            variant="standard"
            type="password"
            style={{width: "100%"}}
            minLength="6"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            id="standard-basic4"
            label="Confirm Password"
            variant="standard"
            type="password"
            style={{width: "100%"}}
            minLength="6"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </CardContent>
        <CardActions className={classes.cardActionsReg}>
          <Button type="submit" variant="contained" size="small" color="primary" style={{fontWeight: "bold"}}>
            Register
          </Button>
        </CardActions>
        <CardActions className={classes.cardActionsLog}>
          <Typography>Already have an account?</Typography>
          <Button href="/login" size="small" color="secondary">
            Login
          </Button>
        </CardActions>
      </Card>
      </form>
    </div>
  );
}

export default Register;

import { useContext } from "react";
import { GlobalContext } from "../../GlobalContext";

import Button from "react-bootstrap/Button";

const Login = () => {
 
  return (
    <div>
      <h1>Welcome to Log in Page </h1>
 
    <Button >Log in as Professor </Button> 

   <h2></h2>

    <Button position='center'>Log in as Register </Button>
   <h3></h3>
    <Button position='center'>Log in as Student </Button>
    </div>
  );
};

export default Login;

import { useContext } from "react";
import { GlobalContext } from "../../GlobalContext";

import Button from "react-bootstrap/Button";

const Profile = () => {
  /* 
    How we access the values of the "GlobaContext" [we can specify what
    we want from the available values using object destructuring]:
  */
  const { isLoggedIn, setIsLoggedIn } = useContext(GlobalContext);

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <>
      <h1>Welcome to GradSchoolZero</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti hic sequi nobis, impedit
        corporis ut quod. Repellat aut ratione dolorem provident error maiores repudiandae minus
        asperiores, temporibus et est quae deserunt fuga neque officia facere perspiciatis optio
        obcaecati enim. Necessitatibus explicabo dolores optio nobis quibusdam non aliquam omnis
        tempore accusamus at blanditiis reprehenderit distinctio, repellendus, laboriosam modi
        similique rem voluptatibus commodi error recusandae eaque ipsam veniam iste! Error id, quis
        iste a quisquam non, debitis, atque repudiandae voluptate sequi dolorem perferendis
        cupiditate placeat quia beatae suscipit temporibus similique animi quos minus voluptatum
        magnam quidem! Accusantium facere possimus quas recusandae provident.
      </p>

      {/* <Button variant={isLoggedIn ? "danger" : "success"} onClick={handleLogin}>
        {isLoggedIn ? "Log Out" : "Log In"}
      </Button> */}

      
         <Button>
           Apply Now 
      </Button>
    </>

 


  );
};

export default Profile;

import { useContext, useState } from "react";
import { GlobalContext } from "../../GlobalContext";

import { Button, Container } from "react-bootstrap";

const Profile = () => {
  /* 
    How we access the values of the "GlobaContext" [we can specify what
    we want from the available values using object destructuring]:
  */
  const { isLoggedIn } = useContext(GlobalContext);

  return (
    <Container>
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

      {isLoggedIn ? null : (
        <div>
          <h2>Applications are open for the Fall 2021 Semester for Students and Instructors!</h2>
          <Button>Apply Now</Button>
        </div>
      )}
    </Container>
  );
};

export default Profile;

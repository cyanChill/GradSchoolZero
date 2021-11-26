import { Container } from "react-bootstrap";
import "./About.css";


const About = () => {
  

  return (
    <Container className="mt-3">




<div className="backgroundImage">
<h1 className="cover">About GradSchoolZero</h1>


</div>
<h2 className="text-uppercase" >We're the original -</h2>
<h2 className="text-uppercase">And we're still meeting the need.</h2>

<div class="show-hide-text">
  <a  id="show-more"  class="show-less" href="#show-less" >Show Less</a>
  <a  id="show-less" class="show-more" href="#show-more">Read More</a>
  <p>
  Since 2021, GradSchoolZero has provided a high quality and affordable
  education to generations of New Yorkers. GradSchoolZero embraces its role
  at the forefront of social change.


  Located in the heart of New York City, GradSchoolZero is home to such
  important 'firsts' as: The first college explicitly founded on the ideal
  of educating the 'whole people', the first documentary film program in the
  U.S. The first intercollegiate lacrosse game played in the U.S. first
  student government in the nation, and the longest running Alumni
  Association in the U.S.

  On it's introduction, it has been ranked #1 by The Chronicle of Higher
  Education out of 369 selective public colleges in the United States on the
  overall mobility index. This measure reflects both access and outcomes,
  representing the likelihood that a student at GradSchoolZero can move up
  two or more income quintiles. In addition, the Center for world University
  Rankings places GradSchoolZero in the top 1.2% of universities worldwide
  in terms of academic excellence. More than 5,000 students pursue graduate
  degrees in eight professional schools and divisions, driven by significant
  funded research, creativity and scholarship. GradSchoolZero is as diverse,
  dynamic and visionary as New York City itself.


  Outstanding programs in engineering and sciences prepare our students for
  the future, and produce outstanding leaders in every field. Our students
  come from around the corner and world, representing more than 150
  nationalities. GradSchoolZero is an integral part of the civic, urban and
  artistic energy of New York and inseparable from its history.
  
</p>
</div>





<div class="columns">
  <div class="row">
    <div class="col">
      <p>Established</p>
        <p>1903</p>
    </div>
    <div class="col">
    <p>Students</p>
        <p>5157</p>
    </div>
    <div class="col">
    <p>Faculty</p>
        <p>721</p>
    </div>
  </div>
</div>

<div className="bottomCover">
  <h1>a new image will go here</h1>
</div>

<div class="container">
  <div class="card">
    <div class="box">
      <div class="content">
        <h2>01</h2>
        <h3>Card One</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, totam velit? Iure nemo labore inventore?</p>
        <a href="#">Read More</a>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="box">
      <div class="content">
        <h2>02</h2>
        <h3>Card Two</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, totam velit? Iure nemo labore inventore?</p>
        <a href="#">Read More</a>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="box">
      <div class="content">
        <h2>03</h2>
        <h3>Card Three</h3>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore, totam velit? Iure nemo labore inventore?</p>
        <a href="#">Read More</a>
      </div>
    </div>
  </div>
</div>













    </Container>
  );











};

export default About;

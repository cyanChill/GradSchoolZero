import { Container } from "react-bootstrap";
import "./About.css";

const About = () => {
  return (
    <div className="custom-body">
      <Container className="custom-container mt-0">
        <div className="custom-backgroundImage">
          <h1 className="custom-cover custom-h1">About GradSchoolZero</h1>
        </div>
        <h2 className="text-uppercase">We're the original -</h2>
        <h2 className="text-uppercase">And we're still meeting the need.</h2>

        <div className="custom-show-hide-text">
          <a
            id="custom-show-more"
            className="custom-show-less"
            href="#custom-show-less"
          >
            Show Less
          </a>
          <a
            id="custom-show-less"
            className="custom-show-more"
            href="#custom-show-more"
          >
            Read More
          </a>
          <p>
            Since 2021, GradSchoolZero has provided a high quality and
            affordable education to generations of New Yorkers.GradSchoolZero
            embraces its role at the forefront of social change.Located in the
            heart of New York City, GradSchoolZero is home to such important
            'firsts' as: The first college explicitly founded on the ideal of
            educating the 'whole people', the first documentary film program in
            the U.S.The first intercollegiate lacrosse game played in the U.S.
            first student government in the nation, and the longest running
            Alumni Association in the U.S.On it's introduction, it has been
            ranked #1 by The Chronicle of Higher Education out of 369 selective
            public colleges in the United States on the overall mobility index.
            This measure reflects both access and outcomes, representing the
            likelihood that a student at GradSchoolZero can move up two or more
            income quintiles.In addition, the Center for world University
            Rankings places GradSchoolZero in the top 1.2% of universities
            worldwide in terms of academic excellence.More than 5,000 students
            pursue graduate degrees in eight professional schools and divisions,
            driven by significant funded research, creativity and scholarship.
            GradSchoolZero is as diverse, dynamic and visionary as New York City
            itself.Outstanding programs in engineering and sciences prepare our
            students for the future, and produce outstanding leaders in every
            field.Our students come from around the corner and world,
            representing more than 150 nationalities.GradSchoolZero is an
            integral part of the civic, urban and artistic energy of New York
            and inseparable from its history.
          </p>
        </div>

        {/* new cards */}

        <div className="custom-container">
          <div className="custom-card">
            <div className="custom-box">
              <div className="custom-content">
                <h2>1961</h2>
                <h3>Established</h3>
              </div>
            </div>
          </div>

          <div className="custom-card">
            <div className="custom-box">
              <div className="custom-content">
                <h2>12161</h2>
                <h3>Students</h3>
              </div>
            </div>
          </div>

          <div className="custom-card">
            <div className="custom-box">
              <div className="custom-content">
                <h2>832</h2>
                <h3>Faculty</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="custom-bottomCover"></div>

        <div calssName="meetTheTeam">
          <h2>Meet The Team</h2>
        </div>
        {/* //profile links #######################*/}
        <section className="lastDiv">
          <div className="profileCards">
            <div className="profileImage image1"></div>
            <h4> Anil Bhushal</h4>
            <p>CSC 322 || CCNY </p>
            <a href="https://www.linkedin.com/in/anil-b-ba8636196/?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAC4DCjABymY9LYRXR2V0B1OrayXERVtPdtg">
              LinkedIn
            </a>
          </div>

          <div className="profileCards">
            <div className="profileImage image2"></div>
            <h4> Anthony Liang</h4>
            <p>CSC 322 || CCNY </p>
            <a href="https://www.linkedin.com/in/anthonyliang9/">LinkedIn</a>
          </div>

          <div className="profileCards">
            <div className="profileImage image3"></div>
            <h4> David Jimenez</h4>
            <p>CSC 322 || CCNY </p>
            <a href="https://www.linkedin.com/in/david-j-b863a7228/">
              LinkedIn
            </a>
          </div>

          <div className="profileCards">
            <div className="profileImage image4"></div>
            <h4> Moshahid Kallol</h4>
            <p>CSC 322 || CCNY </p>
            <a href="https://github.com/mkallol">LinkedIn</a>
          </div>

          <div className="profileCards">
            <div className="profileImage image5"></div>
            <h4> Nafis Khan</h4>
            <p>CSC 322 || CCNY </p>
            <a href="https://www.linkedin.com/in/nafisrk/">LinkedIn</a>
          </div>
        </section>

        {/* //profile links######################### */}
      </Container>
    </div>
  );
};

export default About;

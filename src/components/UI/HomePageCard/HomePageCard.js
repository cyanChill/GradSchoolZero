import { Link, Redirect } from "react-router-dom";
import { CardGroup, Card, Button } from "react-bootstrap";

function HomePageCard() {
  const divStyleGroup = {
    marginTop: 200,
  };

  const divStyleCard = {
    marginLeft: 10,
    marginRight: 10,
  };

  const imgUrl_1 =
    "https://scontent.xx.fbcdn.net/v/t1.15752-9/263157067_908449479800249_6316787283679983039_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=aee45a&_nc_ohc=L1Aq4OyYaVcAX-yYU41&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=3585f2d5f51d0fb5bdb9f32f37f745c1&oe=61D22BCE";
  const imgUrl_2 =
    "https://images.unsplash.com/photo-1596496050755-c923e73e42e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1453&q=80";
  const imgUrl_3 =
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";

  return (
    <CardGroup style={divStyleGroup}>
      <Card style={divStyleCard}>
        <a
          target="_blank"
          href="https://en.wikipedia.org/wiki/City_College_of_New_York"
        >
          <Card.Img variant="top" src={imgUrl_1} />
        </a>
        <Card.Body>
          <Card.Title>The City College Of New York</Card.Title>
          <Card.Text>
            Located in Hamilton Heights overlooking Harlem in Manhattan, City
            College's 35-acre..
          </Card.Text>
        </Card.Body>
      </Card>

      <Card style={divStyleCard}>
        <a
          target="_blank"
          href="https://www.ccny.cuny.edu/academics/areas-of-study"
        >
          <Card.Img variant="top" src={imgUrl_2} />
        </a>
        <Card.Body>
          <Card.Title>Mission Statement</Card.Title>
          <Card.Text>
            City College promotes student success through exceptional integrated
            enrollment services.
          </Card.Text>
        </Card.Body>
      </Card>

      <Card style={divStyleCard}>
        <a
          target="_blank"
          href="https://studentaid.gov/h/understand-aid/how-aid-works"
        >
          <Card.Img variant="top" src={imgUrl_3} />
        </a>
        <Card.Body>
          <Card.Title>Have You Applied For Fafsa?</Card.Title>
          <Card.Text>
            Completing the FAFSA form has never been easier. Get an overview of
            what you’ll need and the steps involved
          </Card.Text>
        </Card.Body>
      </Card>
    </CardGroup>
  );
}

export default HomePageCard;

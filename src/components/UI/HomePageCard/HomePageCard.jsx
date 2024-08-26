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
    "https://www.harlemonestop.com/images/organizations/1542.jpg?v=1587326290";
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
          rel="noreferrer"
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
          rel="noreferrer"
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
          rel="noreferrer"
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

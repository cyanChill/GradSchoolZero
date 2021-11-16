import { useState } from "react";
import { Container, Form, Row, Col, Button, Card } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import useTabooFetch from "../../../hooks/useTabooFetch";
import classes from "./ManageTaboo.module.css";

const ManageTaboo = () => {
  const { tabooList, addTabooWord, deleteTabooWord } = useTabooFetch();
  const [wordField, setWordField] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    await addTabooWord(wordField);
    setWordField("");
  };

  const tabooWords = tabooList.map((word) => (
    <Col key={word} sm="6" md="4" lg="3">
      <Widget word={word} deleteTaboo={deleteTabooWord} />
    </Col>
  ));

  return (
    <Container>
      <h1 className="my-3 text-center">Manage Taboo Words</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Add Taboo Word</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Enter new taboo word"
                    value={wordField}
                    onChange={(e) => setWordField(e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button type="submit">Add</Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <Row>{tabooWords}</Row>
    </Container>
  );
};

export default ManageTaboo;

const Widget = ({ word, deleteTaboo }) => {
  return (
    <Card className={`my-3 ${classes.widget}`}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <p className="p-0 m-0">{word}</p>
        <FaTimes onClick={() => deleteTaboo(word)} />
      </Card.Body>
    </Card>
  );
};

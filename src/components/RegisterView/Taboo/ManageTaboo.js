import { useState, useContext } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { GlobalContext } from "../../../GlobalContext";
import BackButton from "../../UI/BackButton";
import classes from "./ManageTaboo.module.css";

const ManageTaboo = () => {
  const { tabooHook } = useContext(GlobalContext);
  const { tabooList, loading, addTabooWord, deleteTabooWord } = tabooHook;
  const [wordField, setWordField] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    await addTabooWord(wordField);
    setWordField("");
  };

  const tabooWords = tabooList.map((word) => (
    <Col key={word} sm="6" md="4" lg="3" className="my-2">
      <Widget word={word} deleteTaboo={deleteTabooWord} />
    </Col>
  ));

  return (
    <Container>
      <BackButton to="/registrar" btnLabel="Back to Management Page" />
      <h1 className="mt-2 mb-3 text-center">Manage Taboo Words</h1>
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
      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" />
        </div>
      )}
    </Container>
  );
};

export default ManageTaboo;

const Widget = ({ word, deleteTaboo }) => {
  return (
    <Card className={classes.widget}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <p className={classes.word}>{word}</p>
        <FaTimes onClick={() => deleteTaboo(word)} />
      </Card.Body>
    </Card>
  );
};

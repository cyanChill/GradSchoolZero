import { useState, useEffect, useContext } from "react";
import { Container, Tabs, Tab, Button, Alert } from "react-bootstrap";
import BackHeader from "../../UI/BackHeader";
import LinkBoxWidget from "../../UI/LinkBoxWidget/LinkBoxWidget";
import useInfractions from "../../../hooks/useInfractions";
import DualColWidget from "../../UI/DualColWidget/DualColWidget";
import { GlobalContext } from "../../../GlobalContext";
import { Link } from "react-router-dom";

import classes from "./InfractionsPage.module.css";

const InfractionsPage = () => {
  const { userHook } = useContext(GlobalContext);
  const { getAllSuspendedUsers, getAllRemovedUsers } = userHook;
  const { unSuspendUser } = useInfractions();
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [removedUsers, setRemovedUsers] = useState([]);
  const [alertObj, setAlertObj] = useState(null);

  const handleRefresh = async () => {
    const suspUsers = await getAllSuspendedUsers();
    const rmvUsers = await getAllRemovedUsers();
    setSuspendedUsers(suspUsers);
    setRemovedUsers(rmvUsers);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleUnSuspend = async (id) => {
    await unSuspendUser(id);

    setSuspendedUsers((prev) => prev.filter((suspUser) => suspUser.id !== id));

    setAlertObj({
      type: "success",
      title: "Success",
      message: "Successfully unsuspended user",
    });
  };

  const removedUsersWidgets = removedUsers.map((rmvedUser) => (
    <LinkBoxWidget
      key={rmvedUser.id}
      to={`/profile/${rmvedUser.id}`}
      text={rmvedUser.name}
    />
  ));

  const suspendedUsersWidgets = suspendedUsers.map((suspUser) => (
    <UnsuspendWidget
      key={suspUser.id}
      userInfo={suspUser}
      handleSubmit={handleUnSuspend}
    />
  ));

  return (
    <Container>
      <BackHeader
        to="/registrar"
        btnLabel="Back to Management Page"
        headerTitle="Infractions"
      />
      {alertObj && (
        <Alert
          className="my-3"
          variant={alertObj.type}
          onClose={() => setAlertObj(null)}
          dismissible
        >
          <span className="fw-bold">{alertObj.title}: </span>
          {alertObj.message}
        </Alert>
      )}

      <div className="d-flex justify-content-center my-3">
        <Button onClick={handleRefresh}>Refresh</Button>
      </div>
      <Tabs defaultActiveKey="suspended" className="mb-3">
        <Tab eventKey="suspended" title="Suspended">
          {suspendedUsersWidgets.length === 0 ? (
            <p className="text-center">There are no users that are suspended</p>
          ) : (
            suspendedUsersWidgets
          )}
        </Tab>
        <Tab eventKey="fired" title="Expelled/Fired">
          {removedUsersWidgets.length === 0 ? (
            <p className="text-center">
              There are no users that are expelled or fired.
            </p>
          ) : (
            removedUsersWidgets
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

const UnsuspendWidget = ({ userInfo, handleSubmit }) => {
  const { id, name } = userInfo;

  const leftCol = (
    <Link to={`/profile/${id}`} className={classes.link}>
      {name}
    </Link>
  );

  const rightCol = (
    <Button onClick={() => handleSubmit(id)}>Unsuspend User</Button>
  );

  return (
    <DualColWidget
      leftCol={{ body: leftCol }}
      rightCol={{ body: rightCol, breakPoints: { sm: "auto" } }}
    />
  );
};

export default InfractionsPage;

import BackButton from "./BackButton";

const BackHeader = (props) => {
  return (
    <>
      <BackButton
        to={props.to}
        className={props.className}
        btnLabel={props.btnLabel}
      />
      <h1 className="text-center mt-2 mb-3">{props.headerTitle}</h1>
    </>
  );
};

export default BackHeader;

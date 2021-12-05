
const footerStyle = {
  backgroundColor: "#4C74C4",
  fontSize: "20px",
  color: "white",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  padding: "20px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "60px",
  width: "100%",
};

const phantomStyle = {
  display: "block",
  padding: "20px",
  height: "60px",
  width: "100%",
};

const FooterPage = () => {
  return (
    <div>
      <div style={phantomStyle} />
      <div style={footerStyle}>
        <p>Copyright © 2021 - CityDevsCCNY</p>
      </div>
    </div>
  );
};

export default FooterPage;

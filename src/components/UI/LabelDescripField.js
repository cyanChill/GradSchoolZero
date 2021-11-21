const LabelDescripField = ({ label, description, className }) => {
  const classes = `my-1 ${className}`;

  return (
    <div className={classes}>
      <span className="fw-bold">{label}</span>{" "}
      <span className="text-capitalize font-monospace text-muted">
        {description}
      </span>
    </div>
  );
};

export default LabelDescripField;

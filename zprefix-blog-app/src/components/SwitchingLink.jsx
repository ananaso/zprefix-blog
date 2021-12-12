import { Link } from "react-router-dom";

const SwitchingLink = ({ loggedIn, inVals, outVals }) => {
  const { path, text } = loggedIn !== "" ? inVals : outVals;
  return <Link to={path}>{text}</Link>;
};

export default SwitchingLink;

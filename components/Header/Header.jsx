import { ConnectButton } from "web3uikit";
import classes from "./Header.module.css";

const Header = () => {
  return (
    <div className={classes.container}>
      <div className={classes.logo}>Todo App</div>
      <ConnectButton moralisAuth={false} />
    </div>
  );
};

export default Header;

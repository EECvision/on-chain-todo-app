import { useState } from "react";
import classes from "./TodoItem.module.css";
import { ethers } from "ethers";
import { initWrite, listenForTransactionMine } from "../../utils";
import { abi, contractAddress } from "../../constants";
import { useMoralis } from "react-moralis";

const TodoItem = ({ item: { itemId, item } }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(item);
  const [cache] = useState(item);

  const { chainId } = useMoralis();
  const todoAddress =
    parseInt(chainId) in contractAddress
      ? contractAddress[parseInt(chainId)][0]
      : null;

  const handleUpdate = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await initWrite(todoAddress, abi);
    if (contract) {
      try {
        const txResponse = await contract.updateItem(itemId, value);
        const res = await listenForTransactionMine(txResponse, provider);
        console.log(res);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await initWrite(todoAddress, abi);
    if (contract) {
      try {
        console.log("itemToDelete", { itemId });
        const txResponse = await contract.deleteItem(itemId);
        const res = await listenForTransactionMine(txResponse, provider);
        console.log(res);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleCancel = () => {
    setValue(cache);
    setOpen(!open);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.container}>
      {loading ? <div className={classes.loader}>loading...</div> : null}
      <div className={classes.item}>
        <input
          onClick={handleOpen}
          type="text"
          value={value}
          onChange={handleChange}
          disabled={!open}
        />
        <div onClick={handleCancel} className={classes.arrow}>
          v
        </div>
      </div>
      {open ? (
        <div className={classes.editContainer}>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      ) : null}
    </div>
  );
};

export default TodoItem;

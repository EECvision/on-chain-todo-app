import { useState } from "react";
import { initWrite, listenForTransactionMine } from "../../utils";
import classes from "./TodoInput.module.css";
import { abi, contractAddress } from "../../constants";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";

const TodoInput = ({ setUpdateUi }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(0);

  const { chainId } = useMoralis();
  const todoAddress =
    parseInt(chainId) in contractAddress
      ? contractAddress[parseInt(chainId)][0]
      : null;

  const createItem = async () => {
    if (!value) return;
    setLoading(1);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await initWrite(todoAddress, abi);
    if (contract) {
      try {
        const txResponse = await contract.createItem(value);
        setLoading(2);
        await listenForTransactionMine(txResponse, provider);
        setValue("");
        setLoading(0);
        setUpdateUi(true);
      } catch (error) {
        console.log(error);
        setLoading(0);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createItem();
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.formContainer}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="start here..."
        className={classes.formInput}
        disabled={loading}
      />
      <button disabled={loading} type="submit" className={classes.formButton}>
        {loading === 0
          ? "Submit"
          : loading === 1
          ? "Submit..."
          : "Processing..."}
      </button>
    </form>
  );
};

export default TodoInput;

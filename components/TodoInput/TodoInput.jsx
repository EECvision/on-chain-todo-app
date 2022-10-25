import { useState } from "react";
import { initWrite, listenForTransactionMine } from "../../utils";
import classes from "./TodoInput.module.css";
import { abi, contractAddress } from "../../constants";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";

const TodoInput = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const { chainId } = useMoralis();
  const todoAddress =
    parseInt(chainId) in contractAddress
      ? contractAddress[parseInt(chainId)][0]
      : null;

  const createItem = async () => {
    if (!value) return;
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = await initWrite(todoAddress, abi);
    if (contract) {
      try {
        const txResponse = await contract.createItem(value);
        const res = await listenForTransactionMine(txResponse, provider);
        console.log(res);
        setValue("");
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
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
      />
      <button disabled={loading} type="submit" className={classes.formButton}>
        {loading ? "Submit..." : "Submit"}
      </button>
    </form>
  );
};

export default TodoInput;

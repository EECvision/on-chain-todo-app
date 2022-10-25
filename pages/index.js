import classes from "../styles/Home.module.css";
import TodoInput from "../components/TodoInput/TodoInput";
import TodoItem from "../components/TodoItem/TodoItem";
import { useEffect, useState } from "react";
import { abi, contractAddress } from "../constants";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { initRead } from "../utils";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [todoItems, setTodoItems] = useState({});
  const [activeItem, setActiveItem] = useState({});

  const { chainId } = useMoralis();
  const todoAddress =
    parseInt(chainId) in contractAddress
      ? contractAddress[parseInt(chainId)][0]
      : null;

  const getItems = async () => {
    if (!todoAddress) return;
    setLoading(true);
    const contract = await initRead(todoAddress, abi);
    if (contract) {
      try {
        const txResponse = await contract.getItems();
        transformItemsToObject(txResponse);
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };

  const transformItemsToObject = (resArr) => {
    const resObj = {};
    resArr.forEach((res) => {
      resObj[res.itemId.toString()] = {
        itemId: res.itemId.toString(),
        item: res.item,
      };
    });
    console.log({ resObj, resArr });
    setTodoItems(resObj);
  };

  useEffect(() => {
    getItems();
  }, [todoAddress]);

  useEffect(() => {
    if (!todoAddress) return;
    try {
      const provider = new ethers.providers.WebSocketProvider(
        process.env.NEXT_PUBLIC_POLYGON_ALCHEMY_WSS_URL
      );
      const contract = new ethers.Contract(todoAddress, abi, provider);
      contract.on("ItemCreated", (itemId, item) => {
        setActiveItem({ itemId: itemId.toString(), item, action: "create" });
      });
      contract.on("ItemDeleted", (itemId, item) => {
        setActiveItem({ itemId: itemId.toString(), item, action: "delete" });
      });
    } catch (error) {
      console.log(error);
    }
  }, [todoAddress]);

  useEffect(() => {
    const { itemId, item, action } = activeItem;
    console.log({ todoItems, activeItem });
    switch (action) {
      case "create":
        setTodoItems({
          ...todoItems,
          [itemId]: { itemId: itemId, item },
        });
        break;
      case "delete":
        const newItems = { ...todoItems };
        console.log({ itemId });
        delete newItems[itemId];
        console.log({ newItems });
        setTodoItems({ ...newItems });
        break;
      default:
        break;
    }
  }, [activeItem]);

  return (
    <div className={classes.container}>
      <TodoInput />
      {loading ? (
        "loading..."
      ) : (
        <div className={classes.todoItems}>
          {Object.values(todoItems).length > 1
            ? Object.values(todoItems).map((item, idx) =>
                item.item === "" ? null : <TodoItem item={item} key={idx} />
              )
            : "No item available"}
        </div>
      )}
    </div>
  );
}

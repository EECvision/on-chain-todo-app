import classes from "../styles/Home.module.css";
import TodoInput from "../components/TodoInput/TodoInput";
import TodoItem from "../components/TodoItem/TodoItem";
import { useEffect, useState } from "react";
import { abi, contractAddress } from "../constants";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { getNetwork, initRead } from "../utils";
import { switchChain } from "../utils/chainConnect";

const SUPPORTED_NETWORKS = {
  80001: "Polygon Mumbai",
};
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [todoItems, setTodoItems] = useState([]);
  const [activeItem, setActiveItem] = useState({});
  const [network, setNetwork] = useState(true);
  const [updateUi, setUpdateUi] = useState(false);

  const { chainId, isWeb3Enabled } = useMoralis();
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
        const res = txResponse
          .map((tx) => ({
            itemId: tx.itemId.toString(),
            item: tx.item.toString(),
          }))
          .filter((tx) => tx.item !== "");
        setTodoItems(res);
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    getItems();
  }, [todoAddress]);

  useEffect(() => {
    (async () => {
      const res = await getNetwork(parseInt(chainId));
      setNetwork(res);
    })();
  }, [chainId]);

  useEffect(() => {
    if (!todoAddress) return;
    (async () => {
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
    })();
  }, [todoAddress]);

  useEffect(() => {
    if (!updateUi) return;
    const { itemId, item, action } = activeItem;
    let newItems;
    switch (action) {
      case "create":
        const isItem = todoItems.find((todoItem) => todoItem.itemId === itemId);
        if (isItem) {
          newItems = todoItems.map((todoItem) =>
            todoItem.itemId !== itemId ? todoItem : { itemId: itemId, item }
          );
        } else {
          newItems = [...todoItems, { itemId: itemId, item }];
        }

        setTodoItems(newItems);
        break;
      case "delete":
        newItems = todoItems.filter((todoItem) => todoItem.itemId !== itemId);
        setTodoItems(newItems);
        break;
      default:
        break;
    }
    setActiveItem({});
    setUpdateUi(false);
  }, [updateUi]);

  return (
    <div className={classes.container}>
      {isWeb3Enabled ? (
        network ? (
          <>
            <div className={classes.hint_1}>
              Note: request for a test token for your transactions from
              <a
                href="https://faucet.polygon.technology/"
                target="_blank"
                rel="noreferrer"
              >
                faucet.polygon
              </a>
            </div>
            <TodoInput setNetwork={setNetwork} setUpdateUi={setUpdateUi} />
            {loading ? (
              "loading..."
            ) : (
              <div className={classes.todoItems}>
                {todoItems.length ? (
                  todoItems.map((todoItem, idx) =>
                    todoItem.item === "" ? null : (
                      <TodoItem
                        key={idx}
                        todoItem={todoItem}
                        setUpdateUi={setUpdateUi}
                      />
                    )
                  )
                ) : (
                  <div className={classes.hint_1}>No item available</div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className={classes.hint_2}>
            <div>
              Please switch your account to any of our supported networks.{" "}
            </div>
            <div
              className={classes.hintLink}
              onClick={async () => switchChain(80001)}
            >
              {SUPPORTED_NETWORKS[80001]}
            </div>
          </div>
        )
      ) : (
        <div className={classes.hint_3}>
          Please Connect your wallet to continue using this app
        </div>
      )}
    </div>
  );
}

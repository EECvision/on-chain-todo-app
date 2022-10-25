const { assert } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Init Todo", () => {
      let todoContract
      beforeEach(async () => {
        await deployments.fixture(["todo"])
        todoContract = await ethers.getContract("Todo")
      })

      describe("Create Item", () => {
        it("should create a todo item", async () => {
          await todoContract.createItem("hello")
          const item = await todoContract.getItem(1)
          assert.equal(item.item, "hello")
          assert.equal(item.itemId.toString(), "1")
        })

        it("should create multiple todo items", async () => {
          await todoContract.createItem("monday")
          await todoContract.createItem("tuesday")
          await todoContract.createItem("wednesday")
          await todoContract.createItem("thursday")
          await todoContract.createItem("friday")
          await todoContract.createItem("saturday")
          await todoContract.createItem("sunday")
          const item = await todoContract.getItem(5)
          assert.equal(item.item, "friday")
          assert.equal(item.itemId.toString(), "5")
          const items = await todoContract.getItems()
          assert.equal(items.length, 7)
        })
      })

      describe("Update Item", () => {
        it("should update a todo item", async () => {
          await todoContract.createItem("Emma")
          const item = await todoContract.getItem(0)
          await todoContract.updateItem(item.itemId.toString(), "Emmanuel")
          const updatedItem = await todoContract.getItem(0)
          assert(updatedItem.item, "Emmanuel")
        })
      })

      describe("Delete Item", () => {
        it("should delete an Item", async () => {
          await todoContract.createItem("monday")
          await todoContract.createItem("tuesday")
          await todoContract.createItem("wednesday")
          await todoContract.createItem("thursday")
          await todoContract.createItem("friday")
          await todoContract.createItem("saturday")
          await todoContract.createItem("sunday")
          await todoContract.deleteItem(5)
          const items = await todoContract.getItems()
          assert.equal(items.length, 7)
          console.log(items)
          const deletedIndex = await todoContract.getItem(5)
          assert.equal(deletedIndex.item, "")
        })
      })
    })

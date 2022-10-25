// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "hardhat/console.sol";

// It should take input from users and store it on the chain
// It should update existing input
// It should delete input
// It should fire events when any of the actions are taken


/// @author Emmanuel Ezeka
/// @title An on-chain todo application
contract Todo {

    // TYPES
    struct Item {
        uint256 itemId;
        string item;
    }

    uint256 todoCounter = 0;
    mapping(uint256 => Item) items;

    // EVENTS
    event ItemCreated(uint256 itemId, string item);
    event ItemDeleted(uint256 itemId, string item);

    /// create todo item
    function createItem (string memory newItem) public {
        todoCounter = todoCounter + 1;
        items[todoCounter] = Item(todoCounter, newItem);
        emit ItemCreated(todoCounter, newItem);
    }

    /// update todo item
    function updateItem (uint256 itemId, string memory itemToUpdate) public {
        items[itemId].item = itemToUpdate;
        emit ItemCreated(itemId, itemToUpdate);
    }

    /// delete todo item
    function deleteItem (uint256 itemId) public {
        // todoCounter = todoCounter - 1;
        string memory itemToDelete = items[itemId].item;
        delete items[itemId];
        emit ItemDeleted(itemId, itemToDelete);
    }

    // getters
    /// get items
    function getItems() public view returns(Item[] memory) {
        Item[] memory _items = new Item[](todoCounter);
        for(uint256 i=1; i<=todoCounter; i++) {
            bool itemExist = keccak256(abi.encodePacked(items[i].item)) == keccak256(abi.encodePacked(""));
            if(!itemExist) {
                _items[i-1] = items[i];
            }
        }
        return _items;
    }

    /// get item
    function getItem(uint256 itemId) public view returns(Item memory item) {
        return items[itemId];
    }
}
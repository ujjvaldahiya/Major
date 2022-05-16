// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ItemMarketPlace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Item {
        uint id;
        uint price;
        bytes32 proof;
        address owner;
        State state;
    } 

    mapping(bytes32 => Item) private ownedItems; //ItemHash => Item Data
    mapping(uint => bytes32) private ownedItemHash; //ItemID => ItemHash

    uint private totalOwnedItems;

    address payable private owner;

    constructor() {
        setContractOwner(msg.sender);
    }

    /// Course has invalid state!
    error InvalidState();

    /// Course is not created!
    error ItemIsNotCreated();

    /// This item has already been purchased.
    error ItemHasOwner();

    /// Sender is not Item Owner.
    error SenderIsNotItemOwner();

    /// Only the owner has access to this method.
    error OnlyOwner();

    modifier onlyOwner() {
        if(msg.sender != getContractOwner()){
            revert OnlyOwner();
        }
        _;
    }

    function purchaseItem(
        bytes16 ItemId,
        bytes32 proof)
        external
        payable
    {
        bytes32 ItemHash = keccak256(abi.encodePacked(ItemId, msg.sender));
        if(hasItemOwnership(ItemHash)) {
            revert ItemHasOwner();
        }
        uint id = totalOwnedItems++;
        ownedItemHash[id] = ItemHash;
        ownedItems[ItemHash] = Item({id: id, price: msg.value, proof: proof, owner: msg.sender, state: State.Purchased});
    }

    function repurchaseItem(bytes32 itemHash) 
        external
        payable
    {
        if (!isItemCreated(itemHash)){
            revert ItemIsNotCreated();
        }

        if (!hasItemOwnership(itemHash)){
            revert SenderIsNotItemOwner();
        }

        Item storage item = ownedItems[itemHash];

        if (item.state != State.Deactivated){
            revert InvalidState();
        }

        item.state = State.Purchased;
        item.price = msg.value;
    }

    function deActivateItem(bytes32 itemHash)
    external
    onlyOwner
    {
        if (!isItemCreated(itemHash)) {
        revert ItemIsNotCreated();
        }

        Item storage item = ownedItems[itemHash];

        if (item.state != State.Purchased) {
        revert InvalidState();
        }

        (bool success, ) = item.owner.call{value: item.price}("");
        require(success, "Transfer Failed");

        item.state = State.Deactivated;
        item.price = 0;
    }

    function activateItem(bytes32 itemHash)
    external
    onlyOwner
    {
        if (!isItemCreated(itemHash)) {
        revert ItemIsNotCreated();
        }

        Item storage item = ownedItems[itemHash];

        if (item.state != State.Purchased) {
        revert InvalidState();
        }

        item.state = State.Activated;
    }

    function transferOwnership(address newOwner) 
        external
        onlyOwner
    {
        setContractOwner(newOwner);
    }

    function getItemCount()
        external
        view
        returns (uint)
    {
        return totalOwnedItems;
    }

    function getItemHashAtIndex(uint index)
        external
        view
        returns (bytes32)
    {
        return ownedItemHash[index];
    }

    function getItemByHash(bytes32 ItemHash)
        external
        view
        returns (Item memory)
    {
        return ownedItems[ItemHash];
    }

    function getContractOwner() 
        public
        view
        returns (address)
    {
        return owner;
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }

    function isItemCreated(bytes32 itemHash)
        private
        view
        returns (bool)
    {
        return ownedItems[itemHash].owner != 0x0000000000000000000000000000000000000000;
    }

    function hasItemOwnership(bytes32 ItemHash)
        private
        view
        returns (bool)
    {
        return ownedItems[ItemHash].owner == msg.sender;
    }

}
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ItemMarketPlace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    enum reqState {
        Active,
        Accepted,
        Completed
    }

    struct Item {
        uint id;
        uint price;
        bytes32 proof;
        address owner;
        State state;
    } 

    struct Request {
        uint id;
        uint price;
        uint duration;
        uint interest;
        reqState state;
        bytes32 proof;
        address owner;
        uint256 timestamp;
    }

    bool public terminated = false;

    mapping(bytes32 => Item) private ownedItems; //ItemHash => Item Data
    mapping(uint => bytes32) private ownedItemHash; //ItemID => ItemHash

    mapping(uint => Request) private requests; //RequestHash => Request Data

    uint private totalOwnedItems;
    uint private totalRequests;

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

    modifier onlyWhenNotTerminated {
        require(!terminated);
        _;
    }

    modifier onlyWhenTerminated {
        require(terminated);
        _;
    }

    receive() external payable {}

    function withdraw(uint amount)
        external
        onlyOwner
    {
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");
    }

    function emergencyWithdraw()
        external
        onlyOwner
        onlyWhenTerminated
    {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    function selfDestruct()
        external
        onlyWhenTerminated
        onlyOwner
    {
        selfdestruct(owner);
    }

    function terminateContract()
        external
        onlyOwner
    {
        terminated = true;
    }

    function resumeContract() 
        external
        onlyOwner
    {
        terminated = false;
    }
        

    function purchaseItem(
        bytes16 ItemId,
        bytes32 proof)
        external
        payable
        onlyWhenNotTerminated
    {
        bytes32 ItemHash = keccak256(abi.encodePacked(ItemId, msg.sender));
        if(hasItemOwnership(ItemHash)) {
            revert ItemHasOwner();
        }
        uint id = totalOwnedItems++;
        ownedItemHash[id] = ItemHash;
        ownedItems[ItemHash] = Item({id: id, price: msg.value, proof: proof, owner: msg.sender, state: State.Purchased});
    }

    function createRequest(
        uint duration,
        uint interest,
        bytes32 proof
    )
        external
        payable
        onlyWhenNotTerminated
    {
        uint id = totalRequests++;
        requests[id] = Request({id: id, price: msg.value, proof: proof, owner: msg.sender, state: reqState.Active, duration: duration, interest: interest, timestamp: block.timestamp});
    }

    function getRequestCount()
        external
        view
        returns (uint)
    {
        return totalRequests;
    }

    function getRequestByIndex(uint index)
        external
        view
        returns (Request memory)
    {
        return requests[index];
    }

    function repurchaseItem(bytes32 itemHash) 
        external
        payable
        onlyWhenNotTerminated
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
        onlyWhenNotTerminated
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
        onlyWhenNotTerminated
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
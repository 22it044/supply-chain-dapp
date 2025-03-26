// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    enum Role { None, Manufacturer, Distributor, Retailer }
    enum State { Created, Manufactured, Shipped, Delivered }

    struct Product {
        string id;
        State state;
        address updatedBy;
        uint256 timestamp;
        string ipfsHash;
    }

    mapping(address => Role) public roles;
    mapping(string => Product) public products;
    mapping(string => State[]) public history;

    event ProductUpdated(string productId, State state, string ipfsHash);

    modifier onlyRole(Role role) {
        require(roles[msg.sender] == role, "Unauthorized");
        _;
    }

    function assignRole(address account, Role role) external {
        roles[account] = role;
    }

    function createProduct(string calldata productId, string calldata ipfsHash) 
        external onlyRole(Role.Manufacturer) 
    {
        require(products[productId].timestamp == 0, "Product exists");
        products[productId] = Product(productId, State.Manufactured, msg.sender, block.timestamp, ipfsHash);
        history[productId].push(State.Manufactured);
    }

    function updateState(string calldata productId, State newState, string calldata ipfsHash) external {
        Product storage product = products[productId];
        require(product.timestamp != 0, "Product not found");

        if (product.state == State.Manufactured) {
            require(newState == State.Shipped, "Invalid transition");
            require(roles[msg.sender] == Role.Distributor, "Unauthorized");
        } else if (product.state == State.Shipped) {
            require(newState == State.Delivered, "Invalid transition");
            require(roles[msg.sender] == Role.Retailer, "Unauthorized");
        }

        product.state = newState;
        product.updatedBy = msg.sender;
        product.timestamp = block.timestamp;
        product.ipfsHash = ipfsHash;
        history[productId].push(newState);

        emit ProductUpdated(productId, newState, ipfsHash);
    }

    function getHistory(string calldata productId) external view returns (State[] memory) {
        return history[productId];
    }
}
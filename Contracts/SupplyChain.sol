// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title A contract for Supply Chain Management
 * @author Jitendra Gangwar (Enhanced with features from SupplyChainTracker)
 * @notice This contract implements supply chain management with role-based access and tracking
 */
contract SupplyChain {
    // Define roles for access control
    enum Role { None, Producer, Distributor, Retailer, Consumer }
    
    // Define product status
    enum Status { 
        Created, 
        Produced, 
        ShippedToDistributor, 
        ReceivedByDistributor, 
        ShippedToRetailer, 
        ReceivedByRetailer, 
        Available, 
        Sold 
    }
    
    uint public totalProduct = 0;
    uint public totalOrder = 0;
    
    // Mappings for users and roles
    mapping(address => string) public producers;
    mapping(address => Role) public userRoles;
    mapping(address => bool) public admins;
    mapping(address => StakeholderInfo) public stakeholders;
    
    // Mapping for products and orders
    mapping(uint => Product) public products;
    mapping(uint => Order) public orders;
    mapping(uint => TrackingEvent[]) public productHistory;
    
    // Struct definitions
    struct Product {
        uint id;        
        uint price;
        uint quantity;
        string name;
        address producerAddress;
        Status status;
        uint timestamp;
        string metadata;
    }
    
    struct Order {
        uint id;     
        uint productId;
        uint quantity;
        string customerName;
        Status status;
        string deliveryAddress;
        address customerAddress;
        uint timestamp;
    }
    
    struct TrackingEvent {
        address actor;
        Status status;
        uint timestamp;
        string location;
        string comments;
    }
    
    struct StakeholderInfo {
        address userAddress;
        string name;
        Role role;
        bool isActive;
        uint registrationDate;
    }
    
    // Events
    event ProductCreated(uint productId, address producer, uint timestamp);
    event ProductStatusChanged(uint productId, Status newStatus, address actor, uint timestamp);
    event OrderPlaced(uint orderId, uint productId, address customer, uint timestamp);
    event OrderStatusChanged(uint orderId, Status newStatus, address actor, uint timestamp);
    event StakeholderAdded(address stakeholder, Role role, string name);
    
    // Constructor - sets deployer as admin
    constructor() {
        admins[msg.sender] = true;
    }
    
    // Modifiers for access control
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can perform this action");
        _;
    }
    
    modifier onlyProducer() {
        require(userRoles[msg.sender] == Role.Producer && stakeholders[msg.sender].isActive, 
                "Only active producers can perform this action");
        _;
    }
    
    modifier onlyRole(Role role) {
        require(userRoles[msg.sender] == role && stakeholders[msg.sender].isActive,
                "Not authorized for this role");
        _;
    }
    
    modifier productExists(uint _productId) {
        require(_productId > 0 && _productId <= totalProduct, "Product does not exist");
        _;
    }
    
    modifier orderExists(uint _orderId) {
        require(_orderId > 0 && _orderId <= totalOrder, "Order does not exist");
        _;
    }
    
    // Admin functions
    function addAdmin(address _admin) external onlyAdmin {
        admins[_admin] = true;
    }
    
    // Stakeholder management
    function registerStakeholder(address _stakeholder, string calldata _name, Role _role) external onlyAdmin {
        require(_role != Role.None, "Invalid role");
        require(userRoles[_stakeholder] == Role.None, "Stakeholder already registered");
        
        userRoles[_stakeholder] = _role;
        
        stakeholders[_stakeholder] = StakeholderInfo({
            userAddress: _stakeholder,
            name: _name,
            role: _role,
            isActive: true,
            registrationDate: block.timestamp
        });
        
        if (_role == Role.Producer) {
            producers[_stakeholder] = _name;
        }
        
        emit StakeholderAdded(_stakeholder, _role, _name);
    }
    
    function updateStakeholderStatus(address _stakeholder, bool _isActive) external onlyAdmin {
        require(userRoles[_stakeholder] != Role.None, "Stakeholder does not exist");
        stakeholders[_stakeholder].isActive = _isActive;
    }
    
    function registerSelfAsProducer(string memory _name) public {
        require(userRoles[msg.sender] == Role.None, "Already registered");
        
        userRoles[msg.sender] = Role.Producer;
        producers[msg.sender] = _name;
        
        stakeholders[msg.sender] = StakeholderInfo({
            userAddress: msg.sender,
            name: _name,
            role: Role.Producer,
            isActive: true,
            registrationDate: block.timestamp
        });
        
        emit StakeholderAdded(msg.sender, Role.Producer, _name);
    }
    
    function registerSelfAsConsumer(string memory _name) public {
        require(userRoles[msg.sender] == Role.None, "Already registered");
        
        userRoles[msg.sender] = Role.Consumer;
        
        stakeholders[msg.sender] = StakeholderInfo({
            userAddress: msg.sender,
            name: _name,
            role: Role.Consumer,
            isActive: true,
            registrationDate: block.timestamp
        });
        
        emit StakeholderAdded(msg.sender, Role.Consumer, _name);
    }
    
    // Product management functions
    function addNewProduct(
        string memory _name, 
        uint _price, 
        uint _quantity,
        string memory _metadata
    ) public onlyProducer {
        totalProduct += 1;
        
        products[totalProduct] = Product({
            id: totalProduct, 
            price: _price, 
            quantity: _quantity, 
            name: _name, 
            producerAddress: msg.sender,
            status: Status.Created,
            timestamp: block.timestamp,
            metadata: _metadata
        });
        
        // Create initial tracking event
        TrackingEvent memory event_ = TrackingEvent({
            actor: msg.sender,
            status: Status.Created,
            timestamp: block.timestamp,
            location: "",
            comments: "Product created"
        });
        
        productHistory[totalProduct].push(event_);
        
        emit ProductCreated(totalProduct, msg.sender, block.timestamp);
    }
    
    function updateProductStatus(
        uint _productId,
        Status _newStatus,
        string memory _location,
        string memory _comments
    ) public productExists(_productId) {
        Product storage product = products[_productId];
        
        // Check authorization based on status transition
        if (_newStatus == Status.Produced) {
            require(msg.sender == product.producerAddress, "Only producer can update to Produced");
        } else if (_newStatus == Status.ShippedToDistributor || _newStatus == Status.ReceivedByDistributor) {
            require(
                msg.sender == product.producerAddress || 
                userRoles[msg.sender] == Role.Distributor,
                "Not authorized for this status change"
            );
        } else if (_newStatus == Status.ShippedToRetailer || _newStatus == Status.ReceivedByRetailer) {
            require(
                userRoles[msg.sender] == Role.Distributor || 
                userRoles[msg.sender] == Role.Retailer,
                "Not authorized for this status change"
            );
        } else if (_newStatus == Status.Available || _newStatus == Status.Sold) {
            require(
                userRoles[msg.sender] == Role.Retailer,
                "Only retailer can update to Available or Sold"
            );
        }
        
        // Ensure status is advancing forward
        require(uint(_newStatus) > uint(product.status), "Cannot move status backward");
        
        // Update product status
        product.status = _newStatus;
        product.timestamp = block.timestamp;
        
        // Record tracking event
        TrackingEvent memory event_ = TrackingEvent({
            actor: msg.sender,
            status: _newStatus,
            timestamp: block.timestamp,
            location: _location,
            comments: _comments
        });
        
        productHistory[_productId].push(event_);
        
        emit ProductStatusChanged(_productId, _newStatus, msg.sender, block.timestamp);
    }
    
    function updateProductPrice(uint _productId, uint _newPrice) public productExists(_productId) {
        require(products[_productId].producerAddress == msg.sender, "Only producer can update price");
        products[_productId].price = _newPrice;
    }
    
    // Order management functions
    function placeOrder(
        uint _productId,
        uint _quantity,
        string memory _customerName,
        string memory _deliveryAddress
    ) public productExists(_productId) {
        Product storage product = products[_productId];
        
        require(product.quantity >= _quantity, "Insufficient product quantity");
        require(product.status == Status.Available, "Product not available for purchase");
        
        totalOrder += 1;
        
        orders[totalOrder] = Order({
            id: totalOrder,
            productId: _productId,
            quantity: _quantity,
            customerName: _customerName,
            status: Status.Sold,
            deliveryAddress: _deliveryAddress,
            customerAddress: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update product quantity
        product.quantity -= _quantity;
        
        emit OrderPlaced(totalOrder, _productId, msg.sender, block.timestamp);
    }
    
    function updateOrderStatus(
        uint _orderId,
        Status _newStatus,
        string memory _comments
    ) public orderExists(_orderId) {
        Order storage order = orders[_orderId];
        Product storage product = products[order.productId];
        
        // Verify authorization
        if (product.producerAddress == msg.sender || 
            userRoles[msg.sender] == Role.Distributor || 
            userRoles[msg.sender] == Role.Retailer || 
            admins[msg.sender]) {
            
            order.status = _newStatus;
            
            emit OrderStatusChanged(_orderId, _newStatus, msg.sender, block.timestamp);
        } else {
            revert("Not authorized to update this order");
        }
    }
    
    // View functions
    function isProducerRegistered(address _addr) view public returns (bool) {
        return (userRoles[_addr] == Role.Producer);
    }
    
    function getProductById(uint _productId) view public productExists(_productId) returns (
        uint id,
        uint price,
        uint quantity,
        string memory name,
        address producer,
        Status status,
        uint timestamp
    ) {
        Product storage product = products[_productId];
        return (
            product.id,
            product.price,
            product.quantity,
            product.name,
            product.producerAddress,
            product.status,
            product.timestamp
        );
    }
    
    function getOrderById(uint _orderId) view public orderExists(_orderId) returns (
        uint id,
        uint productId,
        uint quantity,
        string memory customerName,
        Status status,
        string memory deliveryAddress,
        address customerAddress,
        uint timestamp
    ) {
        Order storage order = orders[_orderId];
        return (
            order.id,
            order.productId,
            order.quantity,
            order.customerName,
            order.status,
            order.deliveryAddress,
            order.customerAddress,
            order.timestamp
        );
    }
    
    function getTrackingHistory(uint _productId) view public productExists(_productId) returns (TrackingEvent[] memory) {
        return productHistory[_productId];
    }
    
    function getProducerProducts(address _producer) view public returns (uint[] memory) {
        // Count products for this producer
        uint count = 0;
        for (uint i = 1; i <= totalProduct; i++) {
            if (products[i].producerAddress == _producer) {
                count++;
            }
        }
        
        // Create array of product IDs
        uint[] memory result = new uint[](count);
        uint index = 0;
        
        for (uint i = 1; i <= totalProduct; i++) {
            if (products[i].producerAddress == _producer) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
    
    function getCustomerOrders(address _customer) view public returns (uint[] memory) {
        // Count orders for this customer
        uint count = 0;
        for (uint i = 1; i <= totalOrder; i++) {
            if (orders[i].customerAddress == _customer) {
                count++;
            }
        }
        
        // Create array of order IDs
        uint[] memory result = new uint[](count);
        uint index = 0;
        
        for (uint i = 1; i <= totalOrder; i++) {
            if (orders[i].customerAddress == _customer) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
    
    function getUserRole(address _user) view public returns (Role) {
        return userRoles[_user];
    }
}

var abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_pname",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"name": "addNewProductsInList",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_oid",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			}
		],
		"name": "giveOrderItsStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_newPrice",
				"type": "uint256"
			}
		],
		"name": "newPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_cname",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_daddress",
				"type": "string"
			}
		],
		"name": "placeAnOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "registerNewProducer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getMyTotalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_oid",
				"type": "uint256"
			}
		],
		"name": "getOrderByIdConsumer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_oid",
				"type": "uint256"
			}
		],
		"name": "getOrderByIdProducer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getTotalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getTotalProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "isProducerRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "product_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "customer_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "delivery_address",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "customer_address",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "producers",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "product_name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "producer_address",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

var address = "0xCc10D8a7687051Ec063347555d7EA2Ee5722F26a";

web3 = new Web3(web3.currentProvider);
var contract = new web3.eth.Contract(abi, address);
console.log("blockchain connected")

$(document).ready(function () {
	$("#_updatebtn").hide();

	// Setup connect button click
	$('#connect-button').click(async function() {
		await connectMetaMask();
	});

	// Initialize the contract implementation
	window.initContract = async function() {
		if (typeof window.ethereum !== 'undefined') {
			try {
				// Modern dapp browsers
				window.web3 = new Web3(ethereum);
				console.log("Using modern Web3 with ethereum provider");
				
				// Get contract instance
				var contract = new web3.eth.Contract(abi, address);
				
				// Check if user is registered
				const accounts = await ethereum.request({ method: 'eth_accounts' });
				if(accounts.length > 0) {
					contract.methods.isProducerRegistered(accounts[0]).call()
						.then(function(result) {
							if(result) {
								$('#_regdiv').hide();
								loadProducerProducts();
								loadProducerOrders();
							} else {
								$('#_regdiv').show();
							}
						});
				}
				
				return contract;
			} catch (error) {
				console.error("Error initializing contract:", error);
				return null;
			}
		} else if (window.web3) {
			// Legacy dapp browsers
			window.web3 = new Web3(web3.currentProvider);
			console.log("Using legacy Web3");
			var contract = new web3.eth.Contract(abi, address);
			return contract;
		} else {
			console.log('Non-Ethereum browser detected. Consider using MetaMask!');
			return null;
		}
	};

	// Check connection on page load
	checkConnection();

	// Add registration button click handler
	$('#_regbutton').click(function() {
		registration();
	});
	
	// Add product button click handler
	$('#_addbtn').click(function() {
		addProduct();
	});

	// total my product
	web3.eth.getAccounts().then(function (accounts) {
		var account = accounts[0];

		// total my product
		contract.methods.getTotalProduct(account).call().then(function (totalProduct) {
			console.log("totalProduct my : " + totalProduct);
			$("#_totalproduct").html(totalProduct);
		});


		// fetch my products.
		contract.methods.getTotalProduct().call().then(function (totalProduct) {
			console.log("totalProduct (global): " + totalProduct);

			var index = 1;
			for (index = 1; index <= totalProduct; index++) {
				contract.methods.getProductbyId(account, index).call().then(function (productDetails) {
					// index = productDetails + 1;
					console.log(productDetails);
					if (productDetails[4]) {
						var row = "<tr><th>" + productDetails[0] + "</th><td>" + productDetails[3] + "</td><td>" + productDetails[1] + "</td><td>" + productDetails[2] + "</td><td><button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"priceUpdate(" + productDetails[0] + ")\">Change price</button></td></tr>";
						$("#_myproduct_table").find('tbody').append(row);
					}
				});
			}

		});


		// total my product
		contract.methods.getMyTotalOrder(account).call().then(function (totalOrder) {
			console.log("totalOrder my : " + totalOrder);
			$("#_total_order").html(totalOrder);

		});

		// fetch my order.
		contract.methods.getTotalOrder().call().then(function (totalOrder) {
			console.log("totalOrder (global): " + totalOrder);

			var index = 1;
			for (index = 1; index <= totalOrder; index++) {
				contract.methods.getOrderByIdProducer(account, index).call().then(function (orderDetails) {
					// index = orderDetails + 1;
					console.log(orderDetails);
					if (orderDetails[6]) {
						var row = "<tr><th>" + orderDetails[0] + "</th><td>" + orderDetails[1] + "</td><td>" + orderDetails[2] + "</td><td>" + orderDetails[3] + "</td><td>" + orderDetails[5] + "</td><td>" + orderDetails[4] + "</td><td><button type=\"button\" class=\"btn btn-primary btn-sm\" onclick=\"delivered(" + orderDetails[0] + ")\">Delivered</button>\n<button type=\"button\" class=\"btn btn-secondary btn-sm\" onclick=\"reject(" + orderDetails[0] + ")\">Reject</button></td></tr>";
						$("#_order_table").find('tbody').append(row);
					}
				});
			}
		});


	});


	$("#_regbutton").click(function () {
		web3.eth.getAccounts().then(function (accounts) {
			var account = accounts[0];
			var name = $("#_regname").val();

			return contract.methods.registerNewProducer(name).send({ from: account });
		}).then(function (trx) {
			console.log(trx);
			if (trx.status) {
				$("#_regdiv").hide();
			}
		});
	});


	$("#_addbtn").click(function () {
		web3.eth.getAccounts().then(function (accounts) {
			var account = accounts[0];
			var pname = $("#_pname").val();
			var pprice = $("#_price").val();
			var pquantity = $("#_pquantity").val();
			console.log(pname + pprice + pquantity);

			return contract.methods.addNewProductsInList(pname, pprice, pquantity).send({ from: account });
		}).then(function (trx) {
			console.log(trx);
			if (trx.status) {
				alert("Product added!");
				$("#_pname").val("");
				$("#_price").val("");
				$("#_pquantity").val("");
				location.reload();
			}
		});
	});

	$("#_updatebtn").click(function () {
		web3.eth.getAccounts().then(function (accounts) {
			var account = accounts[0];
			var pid = $("#_pname").val();
			var pprice = $("#_price").val();
			console.log("update button click " + pid + pprice);

			return contract.methods.newPrice(pid, pprice).send({ from: account });
		}).then(function (trx) {
			console.log(trx);
			if (trx.status) {
				alert("New Price updated!");
				$("#_nameidlabel").html("Name");
				$("#_pricelabel").html("Price");
				$("#_quantitylabel").show();
				$("#_addbtn").show();
				$("#_updatebtn").hide();
				$("#_pname").val('');
				$("#_price").val('');
				location.reload();
			}
		});
	});


});

function reject(orderId) {
	console.log("Reject " + orderId);

	web3.eth.getAccounts().then(function (accounts) {
		var account = accounts[0];
		var status = "Rejected";
		return contract.methods.giveOrderItsStatus(orderId, status).send({ from: account });
	}).then(function (trx) {
		console.log(trx);
		if (trx.status) {
			alert("Order Rejected!");
			location.reload();
		}
	});
}

function delivered(orderId) {
	console.log("Accept" + orderId);
	web3.eth.getAccounts().then(function (accounts) {
		var account = accounts[0];
		var status = "Accepted";
		return contract.methods.giveOrderItsStatus(orderId, status).send({ from: account });
	}).then(function (trx) {
		console.log(trx);
		if (trx.status) {
			alert("Order Accepted!");
			location.reload();
		}
	});
}

function priceUpdate(productId) {
	console.log("order click : " + productId);
	// alert(productId);

	$("#_nameidlabel").html("Product ID");
	$("#_pricelabel").html("New price");
	$("#_quantitylabel").hide();
	$("#_addbtn").hide();
	$("#_updatebtn").show();
	$("#_pname").val(productId);
}

function gotoBuyer() {
	location.href = "http://127.0.0.1:8080/consumer.html";
}

// Registration function
function registration(){
	var name=document.getElementById("_regname").value;
	if(web3){
		ethereum.request({ method: 'eth_accounts' })
		.then(function(accounts){
			contract.methods.registerNewProducer(name).send({from: accounts[0]})
			.then(function(receipt){
				console.log(receipt);
				alert("Registration successful!");
				$('#_regdiv').hide();
				loadProducerProducts();
			});
		});
	} else {
		alert("Please connect to MetaMask first!");
	}
}

// Load producer products
function loadProducerProducts() {
	if(web3) {
		ethereum.request({ method: 'eth_accounts' })
		.then(function(accounts){
			contract.methods.getTotalProduct(accounts[0]).call()
			.then(function(result) {
				// Clear existing rows
				$('#_myproduct_table tbody').empty();
				
				// If no products
				if(result == 0) {
					return;
				}
				
				// Load products
				for(var i=1; i<=result; i++) {
					loadProductByID(i, accounts[0]);
				}
			});
		});
	}
}

// Load producer orders
function loadProducerOrders() {
	if(web3) {
		ethereum.request({ method: 'eth_accounts' })
		.then(function(accounts){
			contract.methods.getMyTotalOrder(accounts[0]).call()
			.then(function(result) {
				// Clear existing rows
				$('#_order_table tbody').empty();
				
				// If no orders
				if(result == 0) {
					return;
				}
				
				// Load orders
				for(var i=1; i<=result; i++) {
					loadOrderByID(i, accounts[0]);
				}
			});
		});
	}
}

// Add product function
function addProduct() {
	var name = document.getElementById("_pname").value;
	var price = document.getElementById("_price").value;
	var quantity = document.getElementById("_pquantity").value;
	
	if(!web3) {
		alert("Please connect to MetaMask first!");
		return;
	}
	
	ethereum.request({ method: 'eth_accounts' })
	.then(function(accounts) {
		contract.methods.addNewProductsInList(name, price, quantity).send({from: accounts[0]})
		.then(function(receipt) {
			console.log(receipt);
			alert("Product added successfully!");
			loadProducerProducts();
		})
		.catch(function(error) {
			console.error("Error adding product:", error);
			alert("Failed to add product. Make sure you are registered as a producer.");
		});
	});
}

// Update price function
function priceUpdate(productId) {
	var newPrice = prompt("Enter new price for product " + productId);
	if(newPrice === null || newPrice === "") {
		return;
	}
	
	if(!web3) {
		alert("Please connect to MetaMask first!");
		return;
	}
	
	ethereum.request({ method: 'eth_accounts' })
	.then(function(accounts) {
		contract.methods.newPrice(productId, newPrice).send({from: accounts[0]})
		.then(function(receipt) {
			console.log(receipt);
			alert("Price updated successfully!");
			loadProducerProducts();
		})
		.catch(function(error) {
			console.error("Error updating price:", error);
			alert("Failed to update price. Make sure you own this product.");
		});
	});
}

// Delivered function
function delivered(orderId) {
	if(!web3) {
		alert("Please connect to MetaMask first!");
		return;
	}
	
	ethereum.request({ method: 'eth_accounts' })
	.then(function(accounts) {
		contract.methods.giveOrderItsStatus(orderId, "Delivered").send({from: accounts[0]})
		.then(function(receipt) {
			console.log(receipt);
			alert("Order marked as delivered!");
			loadProducerOrders();
		})
		.catch(function(error) {
			console.error("Error updating order status:", error);
			alert("Failed to update order status.");
		});
	});
}

// Reject function
function reject(orderId) {
	if(!web3) {
		alert("Please connect to MetaMask first!");
		return;
	}
	
	ethereum.request({ method: 'eth_accounts' })
	.then(function(accounts) {
		contract.methods.giveOrderItsStatus(orderId, "Rejected").send({from: accounts[0]})
		.then(function(receipt) {
			console.log(receipt);
			alert("Order rejected!");
			loadProducerOrders();
		})
		.catch(function(error) {
			console.error("Error updating order status:", error);
			alert("Failed to update order status.");
		});
	});
}

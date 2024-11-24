const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
  // Extract the limit and offset query parameters
  const { offset = 0, limit = 25, tag } = req.query
  // Pass the limit and offset to the Products service
  res.json(await Products.list({
    offset: Number(offset),
    limit: Number(limit),
    tag
  }));
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params;

  const product = await Products.get(id)
  if (!product) {
    return next();
  }

  return res.json(product);
}

/**
 * Create a product
 * @param {object} req 
 * @param {object} res 
 */
async function createProduct(req, res) {
  console.log('request body:', req.body);
  const product = await Products.create(req.body);
  res.json(product);
}

/**
 * Edit a product
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function editProduct(req, res, next) {
  const change = req.body;
  const product = await Products.update(req.params.id, change);
  res.json(product);
}

/**
 * Delete a product
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
async function deleteProduct(req, res, next) {
  const response = await Products.remove(req.params.id);
  res.json(response);
}

/**
 * List all orders
 * @param {object} req
 * @param {object} res
 */
async function listOrders(req, res) {
  const { offset = 0, limit = 25, productId, status } = req.query;

  const orders = await Orders.list({
    offset: Number(offset),
    limit: Number(limit),
    productId,
    status
  });

  res.json(orders);
}

/**
 * Create an order
 * @param {object} req
 * @param {object} res
 */
async function createOrder(req, res) {
  const orderData = req.body;

  // Validate that the order has products and user_id
  if (!orderData.products || orderData.products.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one product.' })
  }

  // Calculate the total price (this assumes the products are already in the database)
  let totalPrice = 0;
  for (let productId of orderData.products) {
    const product = await Products.get(productId);
    if (product) {
      totalPrice += product.likes; // Assuming likes represent the price of the product for this example
    }
  }

  // Add the total price to the orderData
  orderData.total_price = totalPrice;

  // Create the order using the Orders service
  const order = await Orders.create(orderData)
  res.json(order)
}
// Handler for editing an order
async function editOrder(req, res) {
  const { id } = req.params // Get the order ID from the URL parameter
  const change = req.body    // Get the change object from the request body

  try {
    const updatedOrder = await Orders.edit(id, change) // Call the edit function
    res.json(updatedOrder) // Return the updated order
  } catch (err) {
    res.status(400).json({ error: err.message }) // Handle any errors, e.g., order not found
  }
}

// Handler for deleting an order
async function deleteOrder(req, res) {
  const { id } = req.params // Get the order ID from the URL parameter

  try {
    await Orders.destroy(id) // Call the destroy function to delete the order
    res.status(204).send() // Send a 204 No Content response to indicate successful deletion
  } catch (err) {
    res.status(400).json({ error: err.message }) // Handle any errors, e.g., order not found
  }
}

module.exports = autoCatch({
  handleRoot,
  listProducts,
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  listOrders,
  createOrder,
  editOrder,
  deleteOrder
});

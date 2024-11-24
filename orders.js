const cuid = require('cuid')
const db = require('./db')

const Order = db.model('Order', {
  _id: { type: String, default: cuid },
  buyerEmail: { type: String, required: true },
  products: [{
    type: String,
    ref: 'Product', // ref will automatically fetch associated products for us
    index: true,
    required: true
  }],
  status: {
    type: String,
    index: true,
    default: 'CREATED',
    enum: ['CREATED', 'PENDING', 'COMPLETED']
  }
})

/**
 * List orders
 * @param {Object} options
 * @returns {Promise<Array>}
 */
async function list(options = {}) {
  const { offset = 0, limit = 25, productId, status } = options;

  const productQuery = productId ? {
    products: productId
  } : {}

  const statusQuery = status ? {
    status: status
  } : {}

  const query = {
    ...productQuery,
    ...statusQuery
  }

  const orders = await Order.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)

  return orders
}

/**
 * Get an order
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async function get(_id) {
  const order = await Order.findById(_id)
    .populate('products')
    .exec()
  
  return order
}

/**
 * Create an order
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async function create(fields) {
  const order = await new Order(fields).save()
  await order.populate('products')
  return order
}

/**
 * Edit an existing order
 * @param {String} _id
 * @param {Object} change
 * @returns {Promise<Object>}
 */
async function edit(_id, change) {
  // Find the order by its _id
  const order = await Order.findById(_id)

  if (!order) {
    throw new Error('Order not found')
  }

  // Update the order with the values from the change object
  Object.keys(change).forEach((key) => {
    order[key] = change[key]
  })

  // Save the updated order to the database
  await order.save()
  
  // Populate the products field to get full product details
  await order.populate('products')

  return order
}

/**
 * Delete an order
 * @param {String} _id
 * @returns {Promise<void>}
 */
async function destroy(_id) {
  // Delete the order by its _id
  await Order.deleteOne({ _id })
}

module.exports = {
  create,
  list,
  get,
  edit,
  destroy  // Export the destroy function for use in API
}

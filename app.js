const express = require('express')
const api = require('./api')

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// Register the routes for products
app.get('/products', api.listProducts) // List all products
app.get('/products/:id', api.getProduct) // Get a specific product
app.post('/products', api.createProduct) // Create a new product
app.put('/products/:id', api.editProduct) // Edit a product
app.delete('/products/:id', api.deleteProduct) // Delete a product

// Register the routes for orders
app.get('/orders', api.listOrders) // List all orders
app.post('/orders', api.createOrder) // Create a new order
app.get('/orders', api.listOrders)        // List all orders
app.post('/orders', api.createOrder)      // Create a new order
app.put('/orders/:id', api.editOrder)     // Edit an existing order
app.delete('/orders/:id', api.deleteOrder) // Delete an existing order

app.get('/products', api.listProducts)    // List all products
app.post('/products', api.createProduct)  // Create a new product
app.get('/products/:id', api.getProduct)  // Get a single product
app.put('/products/:id', api.editProduct) // Edit an existing product
app.delete('/products/:id', api.deleteProduct) // Delete a product

module.exports = app

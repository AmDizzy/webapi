const express = require('express')
const controller = express.Router()

const { authorize } = require('../middlewares/authorazation')
const productSchema = require('../schemas/productSchema')

// unsecured routes
controller.route('/').get(async (req, res) => {
    let products = []
    const list = await productSchema.find()
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else {
        res.status(400).json()
    }
})

controller.route('/:tag').get(async (req, res) => {
    let products = []
    const list = await productSchema.find({ tag: req.params.tag })
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else {
        res.status(400).json()
    }
})

controller.route('/:tag/:take').get(async (req, res) => {
    let products = []
    const list = await productSchema.find({ tag: req.params.tag }).limit(req.params.take)
    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                imageName: product.imageName,
                rating: product.rating
            })
        }
        res.status(200).json(products)
    } else {
        res.status(400).json()
    }
})

controller.route('/product/details/:articleNumber').get(async (req, res) => {
    let product = await productSchema.findById(req.params.articleNumber)
    if(product) {
        res.status(200).json({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            imageName: product.imageName,
            rating: product.rating
        })
    } else {
        res.status(404).json()
    }
})

// secured routes

controller.route('/').post(authorize, async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if (!name || !price) {
        res.status(400).json({text: 'Name and price is required.'})
    }

    let item_exists = await productSchema.findOne({name})
    if (item_exists) {
        res.status(409).json({text: 'A product with the same name already exists.'})
    } else {
        let product = await productSchema.create({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if (product)
            res.status(201).json({text: `Product ${product._id} was created successfully.`})
        else
            res.status(400).json({text: 'Something went wrong when we tried to create the product.'})
    }
})

controller.route('/:articleNumber').delete(authorize, async (req, res) => {
    if(!req.params.articleNumber)
        res.status(400).json('No article number was specified.')
    else {
        let item = await productSchema.findById(req.params.articleNumber)

        if (item) {
            await productSchema.remove(item)
            res.status(200).json({text: `Product ${req.params.articleNumber} was successfully deleted.`})
        } else {
            res.status(404).json({text: `Product ${req.params.articleNumber} was not found.`})
        }
    }
})

controller.route('/:articleNumber').put(async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body
    if(!req.params.articleNumber)
        res.status(400).json('No article number was specified.')
    else {
        let item = await productSchema.findById(req.params.articleNumber)
        let product = await productSchema.updateMany({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })

        if (item) {
            await productSchema.updateOne(product)
            res.status(200).json({text: `Product ${req.params.articleNumber} was successfully updated.`})
        } else {
            res.status(404).json({text: `Product ${req.params.articleNumber} was not found.`})
        }
    }
})


module.exports = controller
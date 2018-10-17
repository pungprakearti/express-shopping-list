const express = require('express');
const router = new express.Router();

const shoppingList = {};
let uniqueCount = 0;

// middleware for validating IDs
function validateID(req, res, next) {
  let id = req.params.id;
  if (!shoppingList[id]) {
    let err = new Error('Not an existing ID');
    throw err;
  }
  // this next is definitely necessary
  return next();
}

// show shopping list
router.get('/', function(req, res) {
  res.json(shoppingList);
});

// create shopping list item
router.post('/', function(req, res) {
  let id = generateID();

  // validate request data
  let name = req.body.name;
  let price = req.body.price;

  // if name or price are undefined, throw error
  if (!name || !price) {
    let err = new Error(
      'Invalid parameters. Must have a "name" and a "price" parameter'
    );
    throw err;
  }

  let data = {
    name: req.body.name,
    price: req.body.price
  };

  shoppingList[id] = data;
  res.json(data);
});

// show shopping list item
router.get('/:id', validateID, function(req, res) {
  let id = req.params.id;

  res.json(shoppingList[id]);
});

// update shopping list item
router.patch('/:id', validateID, function(req, res) {
  let id = req.params.id;
  let name = req.body.name;
  let price = req.body.price;

  // don't update empty values
  if (name) shoppingList[id].name = name;
  if (price) shoppingList[id].price = price;

  // catch empty input error
  if (!name && !price) {
    let err = new Error('Must pass a name or a price to patch');
    throw err;
  }

  res.json(shoppingList[id]);
});

// delete shopping list item
router.delete('/:id', validateID, function(req, res) {
  let id = req.params.id;
  delete shoppingList[id];
  res.send(`Deleted ${id}`);
});

function generateID() {
  uniqueCount++;
  return uniqueCount;
}

module.exports = router;

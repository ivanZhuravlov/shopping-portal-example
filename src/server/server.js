// Use Express
const express = require("express");
// Use body-parser
// var bodyParser = require("body-parser");
// Use MongoDB
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

// const fs = require('fs');

const cors = require('cors');

require('dotenv').config();

const {userModel, productModel} = require('./models/all');

// The database variable
let database;
let status = 'DOWN';
// The products collection
const PRODUCTS_COLLECTION = "products";
const USERS_COLLECTION = 'users';

// Create new instance of the express server
const app = express();



// Define the JSON parser as a default way
// to consume and produce data through the
// exposed APIs
app.use(express.json());
app.use(cors());

// Create link to Angular build directory
// The `ng build` command will save the result
// under the `dist` folder.
// var distDir = __dirname + "/dist/";
let distDir = __dirname;
if (process.platform === 'win32') distDir += "\\..\\..\\dist\\shopping-portal-example\\";
else distDir += "/../../dist/shopping-portal-example/";
// distDir = __dirname + "\\dist";
// console.log(distDir);
app.use(express.static(distDir));

// Remote MongoDB URI
const uri = ''; // Specify uri manually here
uri && (process.env.MONGODB_URI = uri);

// Local database URI.
const LOCAL_DATABASE = "mongodb://localhost:27017/app";
// Local port.
const LOCAL_PORT = 3000;

// Init the server
mongodb.MongoClient.connect(process.env.MONGODB_URI || LOCAL_DATABASE,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }, function (error, client) {

    // Check if there are any problems with the connection to MongoDB database.
    if (error) {
      console.log(error);
      process.exit(1);
    }

    // Save database object from the callback for reuse.
    database = client.db();
    console.log("Database connection done.");

    // Initialize the app.
    const server = app.listen(process.env.PORT || LOCAL_PORT, function () {
      const port = server.address().port;
      console.log("App now running on port", port);
    });
    status = "UP";
  });

/*  "/api/status"
 *   GET: Get server status
 *   PS: it's just an example, not mandatory
 */
app.get("/api/status", function (req, res) {
  res.status(200).json({ status });
});

//region Products
/*  "/api/products"
 *  GET: gets all products
 */
app.get("/api/products", function (req, res) {
  database.collection(PRODUCTS_COLLECTION).find({}).toArray(function (error, data) {
    if (error) {
      manageError(res, error.message, "Failed to get products.");
    } else {
      res.status(200).json(data);
    }
  });
});

/*  "/api/products/:id"
 *  GET: gets product by id
 */
app.get("/api/products/:id", function (req, res) {
  database.collection(PRODUCTS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (error, data) {
    if (error) {
      manageError(res, error.message, "Failed to get product.");
    } else {
      console.log('Product found.')
      res.status(200).json(data);
    }
  });
});

/*  "/api/products"
 *   POST: creates a new product
 */
app.post("/api/products", function (req, res) {
  const product = req.body;

  if (!product.name) {
    manageError(res, "Invalid product input", "Name is mandatory.", 400);
  } else if (!product.brand) {
    manageError(res, "Invalid product input", "Brand is mandatory.", 400);
  } else {
    database.collection(PRODUCTS_COLLECTION).insertOne(product, function (err, doc) {
      if (err) {
        manageError(res, err.message, "Failed to create new product.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/products/:id"
 *   PUT: updates an existing product by id
 */
app.put("/api/products/:id", function (req, res) {
  const product = {};
  for (const productProp in productModel) if (req.body[productProp]) product[productProp] = req.body[productProp];

  database.collection(PRODUCTS_COLLECTION).findOneAndUpdate(
    {_id: new ObjectID(req.params.id)},
    {$set: product},
    {returnOriginal: false},
    function (err, doc) {
      if (err) {
        manageError(res, err.message, "Failed to update product")
      } else {
        res.status(200).json(doc.value);
      }
  });
});

/*  "/api/products/:id"
 *   DELETE: deletes product by id
 */
app.delete("/api/products/:id", function (req, res) {
  if (req.params.id.length > 24 || req.params.id.length < 24) {
    manageError(res, "Invalid product id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else {
    database.collection(PRODUCTS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
      if (err) {
        manageError(res, err.message, "Failed to delete product.");
      } else {
        res.status(200).json(req.params.id);
      }
    });
  }
});
//endregion

//region Users
/*  "/api/users"
 *  GET: gets all users
 */
app.get("/api/users", function (req, res) {
  database.collection(USERS_COLLECTION).find({}).toArray(function (error, data) {
    if (error) {
      manageError(res, error.message, "Failed to get users.");
    } else {
      res.status(200).json(data);
    }
  });
});

/*  "/api/users/:id"
 *  GET: gets user by id
 */
app.get("/api/users/:id", function (req, res) {
  database.collection(USERS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (error, data) {
    if (error) {
      manageError(res, error.message, "Failed to get user.");
    } else {
      console.log('User found.')
      res.status(200).json(data);
    }
  });
});

/*  "/api/users"
 *   POST: creates a new user
 */
app.post("/api/users", function (req, res) {
  const user = req.body;

  if (!user.name) {
    manageError(res, "Invalid user input", "Name is mandatory.", 400);
  } else if (!user.password) {
    manageError(res, "Invalid user input", "Password is mandatory.", 400);
  } else if (!user.type || !(user.type === 'user' || user.type === 'admin')) {
    manageError(res, "Invalid user input", "Type of either 'user' or 'admin' is mandatory.",)
  } else {
    user.cart = [];
    user.wishlist = [];
    database.collection(USERS_COLLECTION).insertOne(user, function (err, doc) {
      if (err) {
        manageError(res, err.message, "Failed to create new user.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/users/:id"
 *   PUT: updates an existing user by id
 */
app.put("/api/users/:id", function (req, res) {
  const user = {};
  for (const userProp in userModel) if (req.body[userProp]) user[userProp] = req.body[userProp];

  database.collection(USERS_COLLECTION).findOneAndUpdate(
    {_id: new ObjectID(req.params.id)},
    {$set: user},
    {returnOriginal: false},
    function (err, doc) {
      if (err) {
        manageError(res, err.message, "Failed to update user")
      } else {
        res.status(200).json(doc.value);
      }
    });
});

/*  "/api/users/:id"
 *   DELETE: deletes user by id
 */
app.delete("/api/users/:id", function (req, res) {
  if (req.params.id.length > 24 || req.params.id.length < 24) {
    manageError(res, "Invalid user id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else {
    database.collection(USERS_COLLECTION).deleteOne({ _id: new ObjectID(req.params.id) }, function (err, result) {
      if (err) {
        manageError(res, err.message, "Failed to delete user.");
      } else {
        res.status(200).json(req.params.id);
      }
    });
  }
});
//endregion

//region Carts
/*  "/api/carts/:userid"
 *   GET: gets user's (by userid) cart
 */
// TODO: implement get cart

/*  "/api/carts/:userid/:productid"
 *   POST: adds product by productid to user's (by userid) cart
 */
app.post("/api/carts/:userid/:productid", function (req, res) {
  if (req.params.userid.length !== 24) {
    manageError(res, "Invalid user id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else if (req.params.productid.length !== 24) {
    manageError(res, "Invalid product id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else {
    // TODO: handle adding to cart of existing item in cart by incrementing count by one
    database.collection(USERS_COLLECTION).findOneAndUpdate(
      { _id: new ObjectID(req.params.userid) },
      {$push: {"cart": {_id: req.params.productid, count: 1}}},
      {returnOriginal: false},
      function (err, doc) {
        if (err) {
          manageError(res, err.message, "Failed to add product to cart.");
        } else {
          res.status(200).json(doc.value.cart);
        }
      });
  }
});

// TODO: put for carts that updates the count of a existing product in the cart

/*  "/api/carts/:userid/:productid"
 *   DELETE: deletes product by productid from user's (by userid) cart
 */
app.delete("/api/carts/:userid/:productid", function (req, res) {
  if (req.params.userid.length !== 24) {
    manageError(res, "Invalid user id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else if (req.params.productid.length !== 24) {
    manageError(res, "Invalid product id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else {
    // console.log(req.params.productid);
    database.collection(USERS_COLLECTION).findOneAndUpdate(
      { _id: new ObjectID(req.params.userid) },
      {$pull: {"cart": {_id: req.params.productid}}},
      {returnOriginal: false},
      function (err, doc) {
      if (err) {
        manageError(res, err.message, "Failed to remove product from cart.");
      } else {
        res.status(200).json(doc.value.cart);
      }
    });
  }
});
//endregion

//region Wishlists
/*  "/api/wishlists/:userid"
 *   GET: gets user's (by userid) wishlist
 */
// TODO: implement get wishlist

/*  "/api/wishlists/:userid/:productid"
 *   POST: adds product by productid to user's (by userid) wishlist
 */
app.post("/api/wishlists/:userid/:productid", function (req, res) {
  if (req.params.userid.length !== 24) {
    manageError(res, "Invalid user id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else if (req.params.productid.length !== 24) {
    manageError(res, "Invalid product id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else {
    // TODO: handle adding to wishlist of existing item in cart by ignoring
    database.collection(USERS_COLLECTION).findOneAndUpdate(
      { _id: new ObjectID(req.params.userid) },
      {$push: {"wishlist": {_id: req.params.productid}}},
      {returnOriginal: false},
      function (err, doc) {
        if (err) {
          manageError(res, err.message, "Failed to add product to wishlist.");
        } else {
          res.status(200).json(doc.value.wishlist);
        }
      });
  }
});

/*  "/api/wishlists/:userid/:productid"
 *   DELETE: deletes product by productid from user's (by userid) wishlist
 */
app.delete("/api/wishlists/:userid/:productid", function (req, res) {
  if (req.params.userid.length !== 24) {
    manageError(res, "Invalid user id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else if (req.params.productid.length !== 24) {
    manageError(res, "Invalid product id", "ID must be a single String of 12 bytes or a string of 24 hex characters.", 400);
  } else {
    database.collection(USERS_COLLECTION).findOneAndUpdate(
      { _id: new ObjectID(req.params.userid) },
      {$pull: {"wishlist": {_id: req.params.productid}}},
      {returnOriginal: false},
      function (err, doc) {
        if (err) {
          manageError(res, err.message, "Failed to remove product from wishlist.");
        } else {
          res.status(200).json(doc.value.wishlist);
        }
      });
  }
});
//endregion

//region Auth
/*  "/api/auth
 *  POST: authenticates user by name and password
 */
app.post("/api/auth", function (req, res) {
  // console.log(req.body);
  const { name, password } = req.body;
  if (!name || !password) {
    manageError(res, "Invalid login input.", "Malformed login data.", 400);
  } else {
    database.collection(USERS_COLLECTION).findOne({ name, password }, function (error, data) {
      if (error) {
        manageError(res, error.message, "Auth server error.");
      } else {
        if (data) {
          const { _id, type } = data;
          if (_id && type) {
            console.log("Auth success.");
            res.status(200).json({ _id, type });
          } else {
            manageError(res, "User account document malformed.", "Auth failed. Unusable account.");
          }
        } else {
          manageError(res, "Login data matches no user accounts.", "Auth failed. No such user.");
        }
        
      }
    });
  }
});
//endregion

// FIXME: currently does nothing
app.use(function (err, req, res, next) {
  console.log("Error: " + err.message);
  res.status(502).json({"error": err.message});
  // res.render('error', { error: err });
  next(err);
});

// Errors handler.
function manageError(res, reason, message, code) {
  console.log("Error: " + reason);
  res.status(code || 500).json({ "error": message });
}

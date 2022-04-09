"use strict";

var express = require("express");

var sqlite = require('sqlite3');

var hbs = require("hbs");

var app = express();

var session = require('express-session');

var port = 5500;

var stringSimilarity = require("string-similarity");

var req = require("express/lib/request");

var similarity = stringSimilarity.compareTwoStrings("healed", "sealed");
app.set("view engine", 'hbs');
app.set("views", "./templates/");
hbs.registerPartials(__dirname + "/templates/partials");
app.use(session({
  secret: "berry",
  saveUninitialized: true
}));
app.use(express["static"](__dirname + "/public"));

function get_data() {
  var sql,
      db,
      promise,
      data,
      _args = arguments;
  return regeneratorRuntime.async(function get_data$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          sql = _args.length > 0 && _args[0] !== undefined ? _args[0] : "SELECT * FROM products";
          db = new sqlite.Database("shop.db", function (err) {
            if (err) {
              console.error(err.message);
            } else {//pass
            }
          });
          promise = new Promise(function (res, rej) {
            db.all(sql, function (err, rows) {
              if (err) {
                rej(err);
              } else {
                res(rows);
              }
            });
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(promise);

        case 5:
          data = _context.sent;
          db.close();
          return _context.abrupt("return", data);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}

app.use(function (request, response, next) {
  if (!request.session.visit) {
    request.session.visit = 1;
    request.session.cart = [];
    request.session.like = [];
    request.session.islogin = 0;
  }

  next();
});
app.get('/', function (request, response) {
  var new_data = {
    data: {},
    cart: {},
    islogin: 0
  };

  if (request.session.islogin != 1) {
    var _count = 0;
    get_data().then(function (data) {
      if (request.session.cart.length > 0) {
        for (i in request.session.cart) {
          for (j in data) {
            if (_count == 3) {
              break;
            }

            if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
              new_data["cart"][request.session.cart[i]["product_name"]] = {
                "img": data[j]["img"]
              };
              _count++;
            }
          }
        }
      } else {
        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }
      }

      response.render("index.hbs", new_data);
    });
  } else {
    request.session.islogin = 1;
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = 1").then(function (cart_data) {
      var count = 0;

      for (i in cart_data) {
        if (count == 3) {
          break;
        }

        new_data["cart"][cart_data[i]["product_name"]] = {
          "img": cart_data[i]["img"]
        };
        count++;
      }

      if (Object.keys(new_data["cart"]).length < 1) {
        new_data["cart"] = false;
      }

      response.render("index.hbs", new_data);
    });
  }
}); // let data = {
//     data: {
//         "Морс Клюквенный": {
//             "sm_desc": "Морс",
//             "all_desc": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos aliquam reprehenderit praesentium vitae quibusdam perferendis cupiditate enim excepturi libero. Repudiandae.",
//             "raiting": "5.0",
//             "compound": "Малина, мята, ежевика",
//             "img": "/images/mors.jpeg",
//             "price": 100
//         },
//         "Сок Апельсиновый": {
//             "sm_desc": "Сок",
//             "all_desc": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos aliquam reprehenderit praesentium vitae quibusdam perferendis cupiditate enim excepturi libero. Repudiandae.",
//             "raiting": "5.0",
//             "compound": "Малина, мята, ежевика",
//             "img": "/images/orange.jpeg",
//             "price": 100
//         },
//         "Сок Вишневый": {
//             "sm_desc": "Сок",
//             "all_desc": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos aliquam reprehenderit praesentium vitae quibusdam perferendis cupiditate enim excepturi libero. Repudiandae.",
//             "raiting": "5.0",
//             "compound": "Малина, мята, ежевика",
//             "img": "/images/klukva.jpeg",
//             "price": 100
//         },
//         "Сок ВишневыS": {
//             "sm_desc": "Сок",
//             "all_desc": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos aliquam reprehenderit praesentium vitae quibusdam perferendis cupiditate enim excepturi libero. Repudiandae.",
//             "raiting": "5.0",
//             "compound": "Малина, мята, ежевика",
//             "img": "/images/klukva.jpeg",
//             "price": 100
//         },
//         "Морс Клюквенный2": {
//             "sm_desc": "Морс",
//             "all_desc": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos aliquam reprehenderit praesentium vitae quibusdam perferendis cupiditate enim excepturi libero. Repudiandae.",
//             "raiting": "5.0",
//             "compound": "Малина, мята, ежевика",
//             "img": "/images/mors.jpeg",
//             "price": 100
//         },
//         "Сок Апельсиновый2": {
//             "sm_desc": "Сок",
//             "all_desc": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos aliquam reprehenderit praesentium vitae quibusdam perferendis cupiditate enim excepturi libero. Repudiandae.",
//             "raiting": "5.0",
//             "compound": "Малина, мята, ежевика",
//             "img": "/images/orange.jpeg",
//             "price": 100
//         },
//         "Сок Вишневый2": {
//             "sm_desc": "Сок",
//             "all_desc": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos aliquam reprehenderit praesentium vitae quibusdam perferendis cupiditate enim excepturi libero. Repudiandae.",
//             "raiting": "5.0",
//             "compound": "Малина, мята, ежевика",
//             "img": "/images/klukva.jpeg",
//             "price": 100,
//         },
//         "Сок ВишневыS2": {
//             "sm_desc": "Сок",
//             "all_desc": "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos aliquam reprehenderit praesentium vitae quibusdam perferendis cupiditate enim excepturi libero. Repudiandae.",
//             "raiting": "5.0",
//             "compound": "Малина, мята, ежевика",
//             "img": "/images/klukva.jpeg",
//             "price": 100
//         }
//     }
// }

app.get('/catalog', function (request, response) {
  var new_data = {
    data: {},
    cart: {},
    islogin: 0
  };

  if (request.session.islogin != 1) {
    var type = request.query["type"];
    var product_name = request.query["name"];
    var _count2 = 0;
    get_data().then(function (data) {
      if (request.session.cart.length > 0) {
        for (i in request.session.cart) {
          for (j in data) {
            if (_count2 == 3) {
              break;
            }

            if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
              new_data["cart"][request.session.cart[i]["product_name"]] = {
                "img": data[j]["img"]
              };
              _count2++;
            }
          }
        }
      } else {
        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }
      }

      if (type != undefined && type != {}) {
        for (i in data) {
          if (data[i]["sm_desc"] == type) {
            new_data["data"][data[i]["product_name"]] = data[i];
          }
        }

        if (Object.keys(new_data["data"]).length > 0) {
          response.render("catalog.hbs", new_data);
        } else {
          new_data = {
            data: false
          };
          response.render("catalog.hbs", new_data);
        }
      } else if (product_name != undefined && product_name != {}) {
        for (i in data) {
          if (data[i]["product_name"] == product_name) {
            new_data["data"][data[i]["product_name"]] = data[i];
            break;
          }
        }

        response.render("product.hbs", new_data);
      } else {
        for (i in data) {
          new_data["data"][data[i]["product_name"]] = data[i];
        }

        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }

        response.render("catalog.hbs", new_data);
      }
    });
  } else {
    request.session.islogin = 1;
    var _type = request.query["type"];
    var _product_name = request.query["name"];
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = 1").then(function (cart_data) {
      var count = 0;
      get_data().then(function (data) {
        if (request.session.cart.length > 0) {
          for (i in request.session.cart) {
            for (j in data) {
              if (count == 3) {
                break;
              }

              if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                new_data["cart"][request.session.cart[i]["product_name"]] = {
                  "img": data[j]["img"]
                };
                count++;
              }
            }
          }
        } else {
          if (Object.keys(new_data["cart"]).length < 1) {
            new_data["cart"] = false;
          }
        }

        if (_type != undefined && _type != {}) {
          for (i in data) {
            if (data[i]["sm_desc"] == _type) {
              new_data["data"][data[i]["product_name"]] = data[i];
            }
          }

          if (Object.keys(new_data["data"]).length > 0) {
            response.render("catalog.hbs", new_data);
          } else {
            new_data = {
              data: false
            };
            response.render("catalog.hbs", new_data);
          }
        } else if (_product_name != undefined && _product_name != {}) {
          for (i in data) {
            if (data[i]["product_name"] == _product_name) {
              new_data["data"][data[i]["product_name"]] = data[i];
              break;
            }
          }

          response.render("product.hbs", new_data);
        } else {
          for (i in data) {
            new_data["data"][data[i]["product_name"]] = data[i];
          }

          if (Object.keys(new_data["cart"]).length < 1) {
            new_data["cart"] = false;
          }

          response.render("catalog.hbs", new_data);
        }
      });
    });
  }
});
app.get('/search', function (request, response) {
  var user_search = request.query["q"];
  var product_name = request.query["name"];
  var new_data = {
    data: {},
    cart: {}
  };

  if (request.session.islogin != 1) {
    get_data().then(function (data) {
      if (request.session.cart.length > 0) {
        for (i in request.session.cart) {
          for (j in data) {
            if (count == 3) {
              break;
            }

            if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
              new_data["cart"][request.session.cart[i]["product_name"]] = {
                "img": data[j]["img"]
              };
              count++;
            }
          }
        }
      } else {
        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }
      }

      if (product_name != undefined && product_name != {}) {
        for (i in data["data"]) {
          for (i in data) {
            if (data[i]["product_name"] == product_name) {
              new_data["data"][data[i]["product_name"]] = data[i];
              break;
            }
          }
        }

        response.render("product.hbs", new_data);
      } else {
        for (i in data) {
          if (stringSimilarity.compareTwoStrings(user_search.toLowerCase(), data[i]["product_name"].toLowerCase()) > 0.2) {
            new_data["data"][data[i]["product_name"]] = data[i];
          }
        }

        if (Object.keys(new_data["data"]).length < 1) {
          new_data["data"] = false;
        }

        response.render("search.hbs", new_data);
      }
    });
  } else {
    request.session.islogin = 1;
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product").then(function (cart_data) {
      var count = 0;

      for (i in cart_data) {
        if (count == 3) {
          break;
        }

        new_data["cart"][cart_data[i]["product_name"]] = {
          "img": cart_data[i]["img"]
        };
        count++;
      }

      if (Object.keys(new_data["cart"]).length < 1) {
        new_data["cart"] = false;
      }

      get_data().then(function (data) {
        if (product_name != undefined && product_name != {}) {
          for (i in data["data"]) {
            for (i in data) {
              if (data[i]["product_name"] == product_name) {
                new_data["data"][data[i]["product_name"]] = data[i];
                break;
              }
            }
          }

          response.render("product.hbs", new_data);
        } else {
          for (i in data) {
            if (stringSimilarity.compareTwoStrings(user_search.toLowerCase(), data[i]["product_name"].toLowerCase()) > 0.2) {
              new_data["data"][data[i]["product_name"]] = data[i];
            }
          }

          if (Object.keys(new_data["data"]).length < 1) {
            new_data["data"] = false;
          }

          response.render("search.hbs", new_data);
        }
      });
    });
  }
});
app.get('/cart', function (request, response) {
  var new_data = {
    data: {},
    cart: {}
  };

  if (request.session.islogin != 1) {
    var summ_ = 0;
    var _count3 = 0;
    get_data().then(function (data) {
      if (request.session.cart.length > 0) {
        for (i in request.session.cart) {
          for (j in data) {
            if (_count3 == 3) {
              break;
            }

            if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
              new_data["cart"][request.session.cart[i]["product_name"]] = {
                "img": data[j]["img"]
              };
              _count3++;
            }
          }
        }
      } else {
        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }
      }

      var max_ = 2;

      for (i in request.session.cart) {
        for (j in data) {
          if (request.session.cart[i]["prod_id"] == data[j]["id_product"]) {
            if (data[j]["product_name"] + " (".concat(max_, ")") in new_data["data"]) {
              max_ += 1;
              data[j]["product_name"] = data[j]["product_name"] + " (".concat(max_, ")");
            } else if (data[j]["product_name"] in new_data["data"]) {
              data[j]["product_name"] = data[j]["product_name"] + " (".concat(max_, ")");
            }

            summ_ += Number(request.session.cart[i]["weight"]) / 100 * Number(request.session.cart[i]["value"]) * Number(data[j]["price"]);
            new_data["data"][data[j]["product_name"]] = data[j];
            new_data["data"][data[j]["product_name"]]["value"] = request.session.cart[i]["value"];
            new_data["data"][data[j]["product_name"]]["weight"] = request.session.cart[i]["weight"];
            new_data["data"][data[j]["product_name"]]["itog_price"] = Number(request.session.cart[i]["weight"]) / 100 * Number(request.session.cart[i]["value"]) * Number(data[j]["price"]);
            new_data["summ"] = summ_;
          }
        }
      }

      if (Object.keys(new_data["data"]).length < 1) {
        new_data["data"] = false;
      }

      response.render("cart.hbs", new_data);
    });
  } else {
    request.session.islogin = 1;
    get_data("SELECT cart_id, id_product, product_name, img, price, compound, raiting, sm_desc, value, weight FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product").then(function (cart_data) {
      var summ_ = 0;
      var count = 0;

      for (i in cart_data) {
        if (count == 3) {
          break;
        }

        new_data["cart"][cart_data[i]["product_name"]] = {
          "img": cart_data[i]["img"]
        };
        count++;
      }

      if (Object.keys(new_data["cart"]).length < 1) {
        new_data["cart"] = false;
      }

      var max_ = 2;

      for (i in cart_data) {
        var prod = {};

        if (cart_data[i]["product_name"] + " (".concat(max_, ")") in new_data["data"]) {
          max_ += 1;
          cart_data[i]["product_name"] = cart_data[i]["product_name"] + " (".concat(max_, ")");
        } else if (cart_data[i]["product_name"] in new_data["data"]) {
          cart_data[i]["product_name"] = cart_data[i]["product_name"] + " (".concat(max_, ")");
        }

        prod[cart_data[i]["product_name"]] = cart_data[i];
        prod[cart_data[i]["product_name"]]["itog_price"] = Number(prod[cart_data[i]["product_name"]]["weight"]) / 100 * Number(prod[cart_data[i]["product_name"]]["value"]) * Number(prod[cart_data[i]["product_name"]]["price"]);
        summ_ += Number(prod[cart_data[i]["product_name"]]["weight"]) / 100 * Number(prod[cart_data[i]["product_name"]]["value"]) * Number(prod[cart_data[i]["product_name"]]["price"]);
        new_data["data"][cart_data[i]["product_name"]] = prod[cart_data[i]["product_name"]];
        new_data["summ"] = summ_;
      }

      if (Object.keys(new_data["data"]).length < 1) {
        new_data["data"] = false;
      }

      response.render("cart.hbs", new_data);
    });
  }
});
app.get('/cartadd', function (request, response) {
  var product_name = request.query.name;
  var weight = Number(request.query.weight);
  var val = Number(request.query.val);
  var id_p = request.query.id;

  if (request.session.islogin != 1) {
    var flag = false;
    var cart_id = 0;

    for (i in request.session.cart) {
      if (request.session.cart[i]["product_name"] == product_name) {
        flag = i;
      }
    }

    if (flag) {
      if (weight == request.session.cart[flag]["weight"]) {
        request.session.cart[flag]["value"] += val;
      } else {
        request.session.cart.push({
          "cart_id": cart_id,
          "product_name": product_name,
          "prod_id": id_p,
          "weight": weight,
          "value": val
        });
        cart_id += 1;
      }
    } else {
      request.session.cart.push({
        "cart_id": cart_id,
        "product_name": product_name,
        "prod_id": id_p,
        "weight": weight,
        "value": val
      });
      cart_id += 1;
    }

    response.redirect("/catalog");
  } else {
    request.session.islogin = 1;
    get_data("SELECT * FROM cart WHERE user_id = 1 AND product_id = ".concat(id_p)).then(function (data) {
      if (data.length > 0) {
        if (data[0]["weight"] == weight) {
          get_data("UPDATE cart SET value = ".concat(data[0]['value'] + 1, " WHERE user_id = 1 AND product_id = ").concat(id_p, " AND weight = ").concat(weight)).then(function (prod_id) {
            response.redirect('/catalog');
          });
        } else {
          get_data("INSERT INTO cart(user_id, product_id, value, weight) VALUES(1, ".concat(id_p, ", ").concat(val, ", ").concat(weight, ")")).then(function (prod_id) {
            response.redirect('/catalog');
          });
        }
      } else {
        get_data("INSERT INTO cart(user_id, product_id, value, weight) VALUES(1, ".concat(id_p, ", ").concat(val, ", ").concat(weight, ")")).then(function (prod_id) {
          response.redirect('/catalog');
        });
      }
    });
  }
});
app.get("/cartdelete", function (request, response) {
  var cart_id = request.query.id;

  if (request.session.islogin != 1) {
    delete request.session.cart.cart_id;
  } else {
    get_data("DELETE FROM cart WHERE cart_id = ".concat(cart_id)).then(function (prod_id) {
      response.redirect('/cart');
    });
  }
});
app.get('/like', function (request, response) {
  var new_data = {
    data: {},
    cart: {}
  };

  if (request.session.islogin != 1) {
    get_data().then(function (data) {
      var count = 0;

      for (i in request.session.cart) {
        for (j in data) {
          if (count == 3) {
            break;
          }

          if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
            new_data["cart"][request.session.cart[i]["product_name"]] = {
              "img": data[j]["img"]
            };
            count++;
          }
        }
      }

      for (i in request.session.like) {
        for (j in data) {
          if (request.session.like[i] == data[j]["id_product"]) {
            new_data["data"][data[j]["product_name"]] = data[j];
            new_data["data"][data[j]["product_name"]]["likes_id"] = new_data["data"][data[j]["product_name"]]["id_product"];
          }
        }
      }

      if (Object.keys(new_data["cart"]).length < 1) {
        new_data["cart"] = false;
      }

      if (Object.keys(new_data["data"]).length < 1) {
        new_data["data"] = false;
      }

      response.render("like.hbs", new_data);
    });
  } else {
    get_data("SELECT likes_id, img, product_name, sm_desc, price FROM likes JOIN products ON product_id = id_product").then(function (data) {
      get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product").then(function (cart_data) {
        var count = 0;

        for (i in cart_data) {
          if (count == 3) {
            break;
          }

          new_data["cart"][cart_data[i]["product_name"]] = {
            "img": cart_data[i]["img"]
          };
          count++;
        }

        for (i in data) {
          new_data["data"][data[i]["product_name"]] = data[i];
        }

        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }

        if (Object.keys(new_data["data"]).length < 1) {
          new_data["data"] = false;
        }

        response.render("like.hbs", new_data);
      });
    });
  }
});
app.get("/likeadd", function (request, response) {
  var prod_id = request.query.prod_id;

  if (request.session.islogin != 1) {
    var flag = 0;

    for (i in request.session.like) {
      if (request.session.like[i] == prod_id) {
        flag += 1;
      }
    }

    if (flag == 0) {
      request.session.like.push(prod_id);
    }

    response.redirect("/catalog");
  } else {
    request.session.islogin = 1;
    get_data("SELECT * FROM likes WHERE user_id = 1 AND product_id = ".concat(prod_id)).then(function (data) {
      if (data.length < 1) {
        get_data("INSERT INTO likes(user_id, product_id) VALUES(1, ".concat(prod_id, ")")).then(function (data) {
          response.redirect("/like");
        });
      } else {
        response.redirect("/like");
      }
    });
  }
});
app.get("/likedelete", function (request, response) {
  var prod_id = request.query.id;

  if (request.session.islogin != 1) {
    var mas = [];

    for (i in request.session.like) {
      if (request.session.like[i] != prod_id) {
        mas.push(request.session.like[i]);
      }
    }

    request.session.like = mas;
    response.redirect("/like");
  } else {
    get_data("DELETE FROM likes WHERE likes_id = ".concat(prod_id)).then(function (data) {
      response.redirect("/like");
    });
  }
});
app.get("/info", function (request, response) {
  var new_data = {
    data: {},
    cart: {}
  };

  if (request.session.islogin != 1) {
    var _count4 = 0;
    get_data().then(function (data) {
      if (request.session.cart.length > 0) {
        for (i in request.session.cart) {
          for (j in data) {
            if (_count4 == 3) {
              break;
            }

            if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
              new_data["cart"][request.session.cart[i]["product_name"]] = {
                "img": data[j]["img"]
              };
              _count4++;
            }
          }
        }
      } else {
        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }
      }

      response.render("info.hbs", new_data);
    });
  } else {
    request.session.islogin = 1;
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = 1").then(function (cart_data) {
      var count = 0;

      for (i in cart_data) {
        if (count == 3) {
          break;
        }

        new_data["cart"][cart_data[i]["product_name"]] = {
          "img": cart_data[i]["img"]
        };
        count++;
      }

      if (Object.keys(new_data["cart"]).length < 1) {
        new_data["cart"] = false;
      }

      response.render("info.hbs", new_data);
    });
  }
});
app.listen(port, function () {
  console.log('Hello!');
});
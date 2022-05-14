"use strict";

var express = require("express");

var sqlite = require('sqlite3');

var hbs = require("hbs");

var app = express();

var session = require('express-session');

var jsSHA = require('jssha');

var bodyparser = require('body-parser');

var host = "192.168.12.8";
var port = 5500;
app.use(bodyparser.urlencoded({
  extended: true
}));

var stringSimilarity = require("string-similarity");

var req = require("express/lib/request");

var _require = require("express"),
    response = _require.response;

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
      mass,
      db,
      promise,
      data,
      _args = arguments;
  return regeneratorRuntime.async(function get_data$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          sql = _args.length > 0 && _args[0] !== undefined ? _args[0] : "SELECT * FROM products";
          mass = _args.length > 1 ? _args[1] : undefined;
          db = new sqlite.Database("berry.db", function (err) {
            if (err) {
              console.error(err.message);
            } else {//pass
            }
          });
          promise = new Promise(function (res, rej) {
            db.all(sql, mass, function (err, rows) {
              if (err) {
                rej(err);
              } else {
                res(rows);
              }
            });
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(promise);

        case 6:
          data = _context.sent;
          db.close();
          return _context.abrupt("return", data);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}

function insert_data(sql, mass) {
  var db, promise, data;
  return regeneratorRuntime.async(function insert_data$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          db = new sqlite.Database("berry.db", function (err) {
            if (err) {
              console.error(err.message);
            } else {//pass
            }
          });
          promise = new Promise(function (res, rej) {
            db.run(sql, mass, function (err, rows) {
              if (err) {
                rej(err);
              } else {
                res(rows);
              }
            });
          });
          _context2.next = 4;
          return regeneratorRuntime.awrap(promise);

        case 4:
          data = _context2.sent;
          db.close();
          return _context2.abrupt("return", data);

        case 7:
        case "end":
          return _context2.stop();
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
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
      var count = 0;
      new_data["islogin"] = request.session.user_name;

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
    new_data["islogin"] = request.session.user_name;
    var _type = request.query["type"];
    var _product_name = request.query["name"];
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
      var count = 0;
      get_data().then(function (data) {
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
    cart: {},
    islogin: 0
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
    new_data["islogin"] = request.session.user_name;
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
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
    data: [],
    cart: {},
    summ: 0
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

      for (i in request.session.cart) {
        for (j in data) {
          if (data[j]["product_name"] == request.session.cart[i]["product_name"]) {
            var low_time_product = request.session.cart[i];
            low_time_product["price"] = data[j]["price"];
            low_time_product["id_product"] = data[j]["id_product"];
            low_time_product["sm_desc"] = data[j]["sm_desc"];
            low_time_product["all_desc"] = data[j]["all_desc"];
            low_time_product["img"] = data[j]["img"];
            low_time_product["itog_price"] = Number(low_time_product["price"] * low_time_product["weight"] / 100 * low_time_product["value"]);
            low_time_product["cart_id"] = request.session.cart[i]["cart_id"];
            new_data["data"].push(low_time_product);
            new_data["summ"] += Number(data[j]["price"] * request.session.cart[i]["weight"] / 100 * request.session.cart[i]["value"]);
          }
        }
      }

      response.render("cart.hbs", new_data);
    });
  } else {
    new_data["islogin"] = request.session.user_name;
    get_data("SELECT cart_id, id_product, product_name, img, price, compound, raiting, sm_desc, value, weight FROM `cart` JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
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

      for (i in cart_data) {
        cart_data[i]["itog_price"] = cart_data[i]["price"] * cart_data[i]["weight"] / 100 * cart_data[i]["value"];
        new_data["summ"] += cart_data[i]["itog_price"];
        new_data["data"].push(cart_data[i]);
      } // if (Object.keys(new_data["data"]).length < 1) {
      //     new_data["data"] = false;
      // }


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
          "cart_id": request.session.cart.length + 1,
          "product_name": product_name,
          "prod_id": id_p,
          "weight": weight,
          "value": val
        });
      }
    } else {
      request.session.cart.push({
        "cart_id": request.session.cart.length + 1,
        "product_name": product_name,
        "prod_id": id_p,
        "weight": weight,
        "value": val
      });
    }

    response.redirect("/catalog");
  } else {
    get_data("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [request.session.user_id, id_p]).then(function (data) {
      if (data.length > 0) {
        if (data[0]["weight"] == weight) {
          insert_data("UPDATE cart SET value = ? WHERE user_id = ? AND product_id = ? AND weight = ?", [data[0]['value'] + 1, request.session.user_id, id_p, weight]).then(function (prod_id) {
            response.redirect('/catalog');
          });
        } else {
          insert_data("INSERT INTO cart(user_id, product_id, value, weight) VALUES(?, ?, ?, ?)", [request.session.user_id, id_p, val, weight]).then(function (prod_id) {
            response.redirect('/catalog');
          });
        }
      } else {
        insert_data("INSERT INTO cart(user_id, product_id, value, weight) VALUES(?, ?, ?, ?)", [request.session.user_id, id_p, val, weight]).then(function (prod_id) {
          response.redirect('/catalog');
        });
      }
    });
  }
});
app.get("/cartdelete", function (request, response) {
  var cart_id = request.query.id;

  if (request.session.islogin != 1) {
    for (i in request.session.cart) {
      if (request.session.cart[i]["cart_id"] == cart_id) {
        request.session.cart.splice(i, 1);
      }
    }

    response.redirect('/cart');
  } else {
    insert_data("DELETE FROM cart WHERE cart_id = ?", [cart_id]).then(function (prod_id) {
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
    get_data("SELECT likes_id, img, product_name, sm_desc, price FROM likes JOIN products ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (data) {
      get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
        new_data["islogin"] = request.session.user_name;
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
    get_data("SELECT * FROM likes WHERE user_id = ? AND product_id = ?", [request.session.user_id, prod_id]).then(function (data) {
      if (data.length < 1) {
        get_data("INSERT INTO likes(user_id, product_id) VALUES(?, ?)", [request.session.user_id, prod_id]).then(function (data) {
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
    get_data("DELETE FROM likes WHERE likes_id = ?", [prod_id]).then(function (data) {
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
    new_data["islogin"] = request.session.user_name;
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
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
app.get('/auth', function (request, response) {
  var new_data = {
    data: {},
    cart: {},
    islogin: 0
  };

  if (request.session.islogin != 1) {
    var _count5 = 0;
    get_data().then(function (data) {
      if (request.session.cart.length > 0) {
        for (i in request.session.cart) {
          for (j in data) {
            if (_count5 == 3) {
              break;
            }

            if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
              new_data["cart"][request.session.cart[i]["product_name"]] = {
                "img": data[j]["img"]
              };
              _count5++;
            }
          }
        }
      } else {
        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }
      }

      if (request.session.mess) {
        new_data["mess"] = request.session.mess;
        request.session.mess = undefined;
      } else {
        request.session.mess = false;
      }

      response.render("auth.hbs", new_data);
    });
  } else {
    new_data["islogin"] = request.session.user_name;
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
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

      if (request.session.mess) {
        new_data["mess"] = request.session.mess;
      } else {
        request.session.mess = false;
      }

      response.render("auth.hbs", new_data);
    });
  }
});
app.post("/registration", function (request, response) {
  var user_name = request.body.name;
  var email = request.body.email;
  var password = request.body.password;
  get_data("SELECT * FROM users WHERE email = ?", [email]).then(function (data) {
    if (data.length > 0) {
      request.session.mess = "Почта уже занята";
      response.redirect("/auth");
    } else {
      var shaObj = new jsSHA("SHA3-512", "TEXT", {
        encoding: "UTF8"
      });
      shaObj.update(password);
      var hashedPassword = shaObj.getHash("HEX");
      insert_data("INSERT INTO users(name, email, password, status) VALUES(?, ?, ?, ?)", [user_name, email, hashedPassword, 1]).then(function (data) {
        request.session.islogin = 1;
        request.session.user_name = user_name;
        get_data("SELECT * FROM users WHERE email = ?", [email]).then(function (data2) {
          request.session.user_id = data2[0]["id"];
          request.session.email = email;
          request.session.cart = [];
          request.session.like = [];
          response.redirect("/");
        });
      });
    }
  });
});
app.post("/login", function (request, response) {
  var email = request.body.email;
  var password = request.body.password;
  get_data("SELECT * FROM users WHERE email = ?", [email]).then(function (data) {
    if (data.length > 0) {
      var shaObj = new jsSHA("SHA3-512", "TEXT", {
        encoding: "UTF8"
      });
      shaObj.update(password);
      var hashedPassword = shaObj.getHash("HEX");

      if (hashedPassword == data[0]["password"]) {
        request.session.islogin = 1;
        request.session.user_name = data[0]["name"];
        request.session.email = email;
        request.session.user_id = data[0]["id"];
        request.session.cart = [];
        request.session.like = [];
        response.redirect("/");
      } else {
        request.session.mess = "Неверный пароль";
        response.redirect("/auth");
      }
    } else {
      request.session.mess = "Такой почты не найдено";
      response.redirect("/auth");
    }
  });
});
app.get("/logout", function (request, response) {
  request.session.islogin = 0;
  request.session.user_name = undefined;
  request.session.user_id = undefined;
  response.redirect("/");
});
app.get("/chenge_data", function (request, response) {
  var new_data = {
    data: {},
    cart: {},
    islogin: 0
  };

  if (request.session.islogin != 1) {
    var _count6 = 0;
    get_data().then(function (data) {
      if (request.session.cart.length > 0) {
        for (i in request.session.cart) {
          for (j in data) {
            if (_count6 == 3) {
              break;
            }

            if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
              new_data["cart"][request.session.cart[i]["product_name"]] = {
                "img": data[j]["img"]
              };
              _count6++;
            }
          }
        }
      } else {
        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }
      }

      if (request.session.mess) {
        new_data["mess"] = request.session.mess;
        request.session.mess = undefined;
      } else {
        request.session.mess = false;
      }

      response.render("forgot.hbs", new_data);
    });
  } else {
    new_data["islogin"] = request.session.user_name;
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
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

      if (request.session.mess) {
        new_data["mess"] = request.session.mess;
      } else {
        request.session.mess = false;
      }

      response.render("forgot.hbs", new_data);
    });
  }
});
app.post("/chenge_email", function (request, response) {
  var email = request.body.new_email;
  var user_name = request.body.name;
  var password = request.body.password;

  if (email == request.session.email) {
    request.session.mess = "Это ваша нынешняя почта";
    response.redirect("/chenge_data");
  } else if (user_name != request.session.user_name) {
    request.session.mess = "Это неверное имя";
    response.redirect("/chenge_data");
  } else {
    get_data("SELECT * FROM users WHERE email = ?", [request.session.email]).then(function (data) {
      var shaObj = new jsSHA("SHA3-512", "TEXT", {
        encoding: "UTF8"
      });
      shaObj.update(password);
      var hashedPassword = shaObj.getHash("HEX");

      if (hashedPassword == data[0]["password"]) {
        get_data("SELECT * FROM users").then(function (dataS) {
          var flag = false;

          for (i in dataS) {
            if (dataS[i]["email"] == email) {
              flag = true;
              break;
            }
          }

          if (flag) {
            request.session.mess = "Эта почта занята";
            response.redirect("/chenge_data");
          } else {
            insert_data("UPDATE users SET email = ? WHERE id = ?", [email, request.session.user_id]).then(function (data2) {
              request.session.email = email;
              response.redirect("/");
            });
          }
        });
      } else {
        request.session.mess = "Неверный пароль";
        response.redirect("/chenge_data");
      }
    });
  }
});
app.post("/chenge_password", function (request, response) {
  var user_name = request.body.name;
  var first_password = request.body.password1;
  var second_password = request.body.password2;

  if (user_name != request.session.user_name) {
    request.session.mess = "Это неверное имя";
    response.redirect("/chenge_data");
  } else if (first_password != second_password) {
    request.session.mess = "Пароли на сходятся";
    response.redirect("/chenge_data");
  } else {
    get_data("SELECT * FROM users WHERE email = ?", [request.session.email]).then(function (dataP) {
      var shaObj = new jsSHA("SHA3-512", "TEXT", {
        encoding: "UTF8"
      });
      shaObj.update(first_password);
      var hashedPassword = shaObj.getHash("HEX");

      if (hashedPassword == dataP[0]["password"]) {
        request.session.mess = "Это ненешний пароль";
        response.redirect("/chenge_data");
      } else {
        insert_data("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, request.session.user_id]).then(function (data2) {
          response.redirect("/");
        });
      }
    });
  }
});
app.get("/new_order", function (request, response) {
  var new_data = {
    data: [],
    cart: {},
    islogin: 0,
    summ: 0,
    delivery: 0,
    itogo: 0,
    email: 0
  };

  if (request.session.islogin != 1) {
    var _count7 = 0;
    get_data().then(function (data) {
      if (request.session.cart.length > 0) {
        for (i in request.session.cart) {
          for (j in data) {
            if (_count7 == 3) {
              break;
            }

            if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
              new_data["cart"][request.session.cart[i]["product_name"]] = {
                "img": data[j]["img"]
              };
              _count7++;
            }
          }
        }
      } else {
        if (Object.keys(new_data["cart"]).length < 1) {
          new_data["cart"] = false;
        }
      }

      for (i in request.session.cart) {
        new_data["data"].push({
          "product_name": request.session.cart[i]["product_name"],
          "itog_price": request.session.cart[i]["itog_price"]
        });
        new_data["summ"] += request.session.cart[i]["itog_price"];
      }

      if (new_data["summ"] < 3000) {
        new_data["delivery"] = 690;
        new_data["itogo"] = new_data["summ"] + 690;
      } else {
        new_data["itogo"] = new_data["summ"];
      }

      if (request.session.ordmes) {
        new_data["ordmes"] = request.session.ordmes;
      }

      request.session.ordmes = undefined;
      response.render("new_order.hbs", new_data);
    });
  } else {
    get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
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

      new_data["islogin"] = request.session.user_name;
      new_data["email"] = request.session.email;
      get_data("SELECT cart_id, id_product, product_name, img, price, compound, raiting, sm_desc, value, weight FROM `cart` JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then(function (cart_data) {
        for (i in cart_data) {
          new_data["data"].push({
            "product_name": cart_data[i]["product_name"],
            "itog_price": cart_data[i]["price"] * cart_data[i]["value"] * (cart_data[i]["weight"] / 100)
          });
          new_data["summ"] += cart_data[i]["price"] * cart_data[i]["value"] * (cart_data[i]["weight"] / 100);
        }

        if (new_data["summ"] < 3000) {
          new_data["delivery"] = 690;
          new_data["itogo"] = new_data["summ"] + 690;
        } else {
          new_data["itogo"] = new_data["summ"];
        }

        if (request.session.ordmes) {
          new_data["ordmes"] = request.session.ordmes;
        }

        request.session.ordmes = undefined;
        response.render("new_order.hbs", new_data);
      });
    });
  }
});
app.post("/buy", function (request, response) {
  var data = request.body;

  if (data["phonenumber"] === "") {
    request.session.ordmes = "Укажите номер телефона 4tpehpjke";
    response.redirect("/new_order");
  } else if (data["email"] === "") {
    request.session.ordmes = "Укажите почту iopewhjlrfne";
    response.redirect("/new_order");
  } else {
    pass;
  }
});
app.listen(port, function () {
  console.log('Hello!');
});
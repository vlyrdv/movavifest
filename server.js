const express = require("express");
const sqlite = require('sqlite3');
const hbs = require("hbs");
const app = express();
const session = require('express-session');
const jsSHA = require('jssha');
const bodyparser = require('body-parser');
const host = "192.168.0.116"
const port = 5500;
app.use(
    bodyparser.urlencoded({
        extended: true
    })
);

let stringSimilarity = require("string-similarity");
const req = require("express/lib/request");
const {
    response
} = require("express");

let similarity = stringSimilarity.compareTwoStrings("healed", "sealed");

app.set("view engine", 'hbs');
app.set("views", "./templates/");
hbs.registerPartials(__dirname + "/templates/partials");

app.use(session({
    secret: "berry",
    saveUninitialized: true
}))

app.use(express.static(__dirname + "/public"));

async function get_data(sql = "SELECT * FROM products", mass) {
    let db = new sqlite.Database("berry.db", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            //pass
        }
    });

    let promise = new Promise((res, rej) => {
        db.all(sql, mass, (err, rows) => {
            if (err) {
                rej(err);
            } else {
                res(rows)
            }
        });
    })

    let data = await promise;
    db.close();
    return data;
}

async function insert_data(sql, mass) {
    let db = new sqlite.Database("berry.db", (err) => {
        if (err) {
            console.error(err.message);
        } else {
            //pass
        }
    });


    let promise = new Promise((res, rej) => {
        db.run(sql, mass, (err, rows) => {
            if (err) {
                rej(err);
            } else {
                res(rows)
            }
        });
    })

    let data = await promise;
    db.close();
    return data;
}

app.use((request, response, next) => {
    if (!request.session.visit) {
        request.session.visit = 1
        request.session.cart = []
        request.session.like = []
        request.session.islogin = 0
    }
    next();
})

app.get('/', (request, response) => {
    let new_data = {
        data: {

        },
        cart: {},
        islogin: 0
    }
    if (request.session.islogin != 1) {
        let count = 0
        get_data().then((data) => {
            if (request.session.cart.length > 0) {
                for (i in request.session.cart) {
                    for (j in data) {
                        if (count == 3) {
                            break
                        }
                        if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                            new_data["cart"][request.session.cart[i]["product_name"]] = {
                                "img": data[j]["img"]
                            }
                            count++
                        }
                    }
                }
            } else {
                if (Object.keys(new_data["cart"]).length < 1) {
                    new_data["cart"] = false;
                }
            }
            response.render("index.hbs", new_data);
        })
    } else {
        get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
            let count = 0
            new_data["islogin"] = request.session.user_name;
            for (i in cart_data) {
                if (count == 3) {
                    break
                }
                new_data["cart"][cart_data[i]["product_name"]] = {
                    "img": cart_data[i]["img"]
                }
                count++
            }
            if (Object.keys(new_data["cart"]).length < 1) {
                new_data["cart"] = false;
            }
            response.render("index.hbs", new_data);
        })
    }
});
// let data = {
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
app.get('/catalog', (request, response) => {
    let new_data = {
        data: {

        },
        cart: {},
        islogin: 0
    }
    if (request.session.islogin != 1) {
        let type = request.query["type"];
        let product_name = request.query["name"];
        let count = 0
        get_data().then((data) => {
            if (request.session.cart.length > 0) {
                for (i in request.session.cart) {
                    for (j in data) {
                        if (count == 3) {
                            break
                        }
                        if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                            new_data["cart"][request.session.cart[i]["product_name"]] = {
                                "img": data[j]["img"]
                            }
                            count++
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
                        new_data["data"][data[i]["product_name"]] = data[i]
                    }
                }
                if (Object.keys(new_data["data"]).length > 0) {
                    response.render("catalog.hbs", new_data);
                } else {
                    new_data = {
                        data: false
                    }
                    response.render("catalog.hbs", new_data);
                }
            } else if (product_name != undefined && product_name != {}) {
                for (i in data) {
                    if (data[i]["product_name"] == product_name) {
                        new_data["data"][data[i]["product_name"]] = data[i]
                        break
                    }
                }
                response.render("product.hbs", new_data)
            } else {
                for (i in data) {
                    new_data["data"][data[i]["product_name"]] = data[i]
                }
                if (Object.keys(new_data["cart"]).length < 1) {
                    new_data["cart"] = false;
                }
                response.render("catalog.hbs", new_data);
            }
        })
    } else {
        new_data["islogin"] = request.session.user_name;
        let type = request.query["type"];
        let product_name = request.query["name"];
        get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
            let count = 0
            get_data().then((data) => {
                let summ_ = 0
                let count = 0
                for (i in cart_data) {
                    if (count == 3) {
                        break
                    }
                    new_data["cart"][cart_data[i]["product_name"]] = {
                        "img": cart_data[i]["img"]
                    }
                    count++
                }
                if (Object.keys(new_data["cart"]).length < 1) {
                    new_data["cart"] = false;
                }
                if (type != undefined && type != {}) {
                    for (i in data) {
                        if (data[i]["sm_desc"] == type) {
                            new_data["data"][data[i]["product_name"]] = data[i]
                        }
                    }
                    if (Object.keys(new_data["data"]).length > 0) {
                        response.render("catalog.hbs", new_data);
                    } else {
                        new_data = {
                            data: false
                        }
                        response.render("catalog.hbs", new_data);
                    }
                } else if (product_name != undefined && product_name != {}) {
                    for (i in data) {
                        if (data[i]["product_name"] == product_name) {
                            new_data["data"][data[i]["product_name"]] = data[i]
                            break
                        }
                    }
                    response.render("product.hbs", new_data)
                } else {
                    for (i in data) {
                        new_data["data"][data[i]["product_name"]] = data[i]
                    }
                    if (Object.keys(new_data["cart"]).length < 1) {
                        new_data["cart"] = false;
                    }
                    response.render("catalog.hbs", new_data);
                }
            })
        });
    }
});

app.get('/search', (request, response) => {
    let user_search = request.query["q"];
    let product_name = request.query["name"];
    let new_data = {
        data: {

        },
        cart: {},
        islogin: 0
    }
    if (request.session.islogin != 1) {
        get_data().then((data) => {
            if (request.session.cart.length > 0) {
                for (i in request.session.cart) {
                    for (j in data) {
                        if (count == 3) {
                            break
                        }
                        if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                            new_data["cart"][request.session.cart[i]["product_name"]] = {
                                "img": data[j]["img"]
                            }
                            count++
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
                            new_data["data"][data[i]["product_name"]] = data[i]
                            break
                        }
                    }
                }
                response.render("product.hbs", new_data)
            } else {
                for (i in data) {
                    if (stringSimilarity.compareTwoStrings(user_search.toLowerCase(), data[i]["product_name"].toLowerCase()) > 0.2) {
                        new_data["data"][data[i]["product_name"]] = data[i]
                    }
                }
                if (Object.keys(new_data["data"]).length < 1) {
                    new_data["data"] = false;
                }
                response.render("search.hbs", new_data);
            }
        })
    } else {
        new_data["islogin"] = request.session.user_name;
        get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
            let count = 0
            for (i in cart_data) {
                if (count == 3) {
                    break
                }
                new_data["cart"][cart_data[i]["product_name"]] = {
                    "img": cart_data[i]["img"]
                }
                count++
            }
            if (Object.keys(new_data["cart"]).length < 1) {
                new_data["cart"] = false;
            }
            get_data().then((data) => {
                if (product_name != undefined && product_name != {}) {
                    for (i in data["data"]) {
                        for (i in data) {
                            if (data[i]["product_name"] == product_name) {
                                new_data["data"][data[i]["product_name"]] = data[i]
                                break
                            }
                        }
                    }
                    response.render("product.hbs", new_data)
                } else {
                    for (i in data) {
                        if (stringSimilarity.compareTwoStrings(user_search.toLowerCase(), data[i]["product_name"].toLowerCase()) > 0.2) {
                            new_data["data"][data[i]["product_name"]] = data[i]
                        }
                    }
                    if (Object.keys(new_data["data"]).length < 1) {
                        new_data["data"] = false;
                    }
                    response.render("search.hbs", new_data);
                }
            })
        })
    }
})

app.get('/cart', (request, response) => {
    let new_data = {
        data: [],
        cart: {

        },
        summ: 0
    }
    if (request.session.islogin != 1) {
        let summ_ = 0
        let count = 0
        get_data().then((data) => {
            if (request.session.cart.length > 0) {
                for (i in request.session.cart) {
                    for (j in data) {
                        if (count == 3) {
                            break
                        }
                        if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                            new_data["cart"][request.session.cart[i]["product_name"]] = {
                                "img": data[j]["img"]
                            }
                            count++
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
                        let low_time_product = request.session.cart[i]
                        low_time_product["price"] = data[j]["price"]
                        low_time_product["id_product"] = data[j]["id_product"]
                        low_time_product["sm_desc"] = data[j]["sm_desc"]
                        low_time_product["all_desc"] = data[j]["all_desc"]
                        low_time_product["img"] = data[j]["img"]
                        low_time_product["itog_price"] = Number(low_time_product["price"] * low_time_product["weight"] / 100 * low_time_product["value"])
                        low_time_product["cart_id"] = request.session.cart[i]["cart_id"]
                        new_data["data"].push(low_time_product)
                        new_data["summ"] += Number(data[j]["price"] * request.session.cart[i]["weight"] / 100 * request.session.cart[i]["value"])
                    }
                }
            }
            response.render("cart.hbs", new_data)
        })
    } else {
        new_data["islogin"] = request.session.user_name;
        get_data("SELECT cart_id, id_product, product_name, img, price, compound, raiting, sm_desc, value, weight FROM `cart` JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
            let summ_ = 0
            let count = 0
            for (i in cart_data) {
                if (count == 3) {
                    break
                }
                new_data["cart"][cart_data[i]["product_name"]] = {
                    "img": cart_data[i]["img"]
                }
                count++
            }
            if (Object.keys(new_data["cart"]).length < 1) {
                new_data["cart"] = false;
            }
            for (i in cart_data) {
                cart_data[i]["itog_price"] = cart_data[i]["price"] * cart_data[i]["weight"] / 100 * cart_data[i]["value"]
                new_data["summ"] += cart_data[i]["itog_price"]
                new_data["data"].push(cart_data[i])
            }
            // if (Object.keys(new_data["data"]).length < 1) {
            //     new_data["data"] = false;
            // }
            response.render("cart.hbs", new_data);
        })
    }
})

app.get('/cartadd', (request, response) => {
    let product_name = request.query.name
    let weight = Number(request.query.weight)
    let val = Number(request.query.val)
    let id_p = request.query.id
    if (request.session.islogin != 1) {
        let flag = false
        for (i in request.session.cart) {
            if (request.session.cart[i]["product_name"] == product_name) {
                flag = i
            }
        }
        if (flag) {
            if (weight == request.session.cart[flag]["weight"]) {
                request.session.cart[flag]["value"] += val
            } else {
                request.session.cart.push({
                    "cart_id": request.session.cart.length + 1,
                    "product_name": product_name,
                    "prod_id": id_p,
                    "weight": weight,
                    "value": val,
                })
            }
        } else {
            request.session.cart.push({
                "cart_id": request.session.cart.length + 1,
                "product_name": product_name,
                "prod_id": id_p,
                "weight": weight,
                "value": val
            })
        }
        response.redirect("/catalog")
    } else {
        get_data("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [request.session.user_id, id_p]).then((data) => {
            if (data.length > 0) {
                if (data[0]["weight"] == weight) {
                    insert_data(`UPDATE cart SET value = ? WHERE user_id = ? AND product_id = ? AND weight = ?`, [data[0]['value'] + 1, request.session.user_id, id_p, weight]).then((prod_id) => {
                        response.redirect('/catalog');
                    })
                } else {
                    insert_data(`INSERT INTO cart(user_id, product_id, value, weight) VALUES(?, ?, ?, ?)`, [request.session.user_id, id_p, val, weight]).then((prod_id) => {
                        response.redirect('/catalog');
                    })
                }
            } else {
                insert_data(`INSERT INTO cart(user_id, product_id, value, weight) VALUES(?, ?, ?, ?)`, [request.session.user_id, id_p, val, weight]).then((prod_id) => {
                    response.redirect('/catalog');
                })
            }
        })
    }
})

app.get("/cartdelete", (request, response) => {
    let cart_id = request.query.id
    if (request.session.islogin != 1) {
        for (i in request.session.cart) {
            if (request.session.cart[i]["cart_id"] == cart_id) {
                request.session.cart.splice(i, 1)
            }
        }
        response.redirect('/cart');
    } else {
        insert_data("DELETE FROM cart WHERE cart_id = ?", [cart_id]).then((prod_id) => {
            response.redirect('/cart');
        })
    }
})

app.get('/like', (request, response) => {
    let new_data = {
        data: {

        },
        cart: {

        }
    }
    if (request.session.islogin != 1) {
        get_data().then((data) => {
            let count = 0
            for (i in request.session.cart) {
                for (j in data) {
                    if (count == 3) {
                        break
                    }
                    if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                        new_data["cart"][request.session.cart[i]["product_name"]] = {
                            "img": data[j]["img"]
                        }
                        count++
                    }
                }
            }
            for (i in request.session.like) {
                for (j in data) {
                    if (request.session.like[i] == data[j]["id_product"]) {
                        new_data["data"][data[j]["product_name"]] = data[j]
                        new_data["data"][data[j]["product_name"]]["likes_id"] = new_data["data"][data[j]["product_name"]]["id_product"]
                    }
                }
            }
            if (Object.keys(new_data["cart"]).length < 1) {
                new_data["cart"] = false;
            }
            if (Object.keys(new_data["data"]).length < 1) {
                new_data["data"] = false;
            }
            response.render("like.hbs", new_data)
        })
    } else {
        get_data("SELECT likes_id, img, product_name, sm_desc, price FROM likes JOIN products ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((data) => {
            get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
                new_data["islogin"] = request.session.user_name;
                let count = 0
                for (i in cart_data) {
                    if (count == 3) {
                        break
                    }
                    new_data["cart"][cart_data[i]["product_name"]] = {
                        "img": cart_data[i]["img"]
                    }
                    count++
                }
                for (i in data) {
                    new_data["data"][data[i]["product_name"]] = data[i]
                }
                if (Object.keys(new_data["cart"]).length < 1) {
                    new_data["cart"] = false;
                }
                if (Object.keys(new_data["data"]).length < 1) {
                    new_data["data"] = false;
                }
                response.render("like.hbs", new_data)
            })
        })
    }
})

app.get("/likeadd", (request, response) => {
    let prod_id = request.query.prod_id;
    if (request.session.islogin != 1) {
        let flag = 0
        for (i in request.session.like) {
            if (request.session.like[i] == prod_id) {
                flag += 1
            }
        }
        if (flag == 0) {
            request.session.like.push(prod_id);
        }

        response.redirect("/catalog");
    } else {
        get_data("SELECT * FROM likes WHERE user_id = ? AND product_id = ?", [request.session.user_id, prod_id]).then((data) => {
            if (data.length < 1) {
                get_data(`INSERT INTO likes(user_id, product_id) VALUES(?, ?)`, [request.session.user_id, prod_id]).then((data) => {
                    response.redirect("/like");
                })
            } else {
                response.redirect("/like")
            }
        })
    }
})

app.get("/likedelete", (request, response) => {
    let prod_id = request.query.id;
    if (request.session.islogin != 1) {
        let mas = [];
        for (i in request.session.like) {
            if (request.session.like[i] != prod_id) {
                mas.push(request.session.like[i])
            }
        }
        request.session.like = mas
        response.redirect("/like");
    } else {
        get_data("DELETE FROM likes WHERE likes_id = ?", [prod_id]).then((data) => {
            response.redirect("/like")
        })
    }
})

app.get("/info", (request, response) => {
    let new_data = {
        data: {

        },
        cart: {}
    }
    if (request.session.islogin != 1) {
        let count = 0
        get_data().then((data) => {
            if (request.session.cart.length > 0) {
                for (i in request.session.cart) {
                    for (j in data) {
                        if (count == 3) {
                            break
                        }
                        if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                            new_data["cart"][request.session.cart[i]["product_name"]] = {
                                "img": data[j]["img"]
                            }
                            count++
                        }
                    }
                }
            } else {
                if (Object.keys(new_data["cart"]).length < 1) {
                    new_data["cart"] = false;
                }
            }
            response.render("info.hbs", new_data);
        })
    } else {
        new_data["islogin"] = request.session.user_name;
        get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
            let count = 0
            for (i in cart_data) {
                if (count == 3) {
                    break
                }
                new_data["cart"][cart_data[i]["product_name"]] = {
                    "img": cart_data[i]["img"]
                }
                count++
            }
            if (Object.keys(new_data["cart"]).length < 1) {
                new_data["cart"] = false;
            }
            response.render("info.hbs", new_data);
        })
    }
})


app.get('/auth', (request, response) => {
    let new_data = {
        data: {

        },
        cart: {},
        islogin: 0
    }
    if (request.session.islogin != 1) {
        let count = 0
        get_data().then((data) => {
            if (request.session.cart.length > 0) {
                for (i in request.session.cart) {
                    for (j in data) {
                        if (count == 3) {
                            break
                        }
                        if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                            new_data["cart"][request.session.cart[i]["product_name"]] = {
                                "img": data[j]["img"]
                            }
                            count++
                        }
                    }
                }
            } else {
                if (Object.keys(new_data["cart"]).length < 1) {
                    new_data["cart"] = false;
                }
            }
            if (request.session.mess) {
                new_data["mess"] = request.session.mess
                request.session.mess = undefined
            } else {
                request.session.mess = false
            }
            response.render("auth.hbs", new_data);
        })
    } else {
        new_data["islogin"] = request.session.user_name;
        get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
            let count = 0
            for (i in cart_data) {
                if (count == 3) {
                    break
                }
                new_data["cart"][cart_data[i]["product_name"]] = {
                    "img": cart_data[i]["img"]
                }
                count++
            }
            if (Object.keys(new_data["cart"]).length < 1) {
                new_data["cart"] = false;
            }
            if (request.session.mess) {
                new_data["mess"] = request.session.mess
            } else {
                request.session.mess = false
            }
            response.render("auth.hbs", new_data);
        })
    }
});

app.post("/registration", (request, response) => {
    let user_name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;
    get_data(`SELECT * FROM users WHERE email = ?`, [email]).then((data) => {
        if (data.length > 0) {
            request.session.mess = "Почта уже занята"
            response.redirect("/auth")
        } else {
            const shaObj = new jsSHA("SHA3-512", "TEXT", {
                encoding: "UTF8",
            });
            shaObj.update(password);
            const hashedPassword = shaObj.getHash("HEX");
            insert_data("INSERT INTO users(name, email, password, status) VALUES(?, ?, ?, ?)", [user_name, email, hashedPassword, 1]).then((data) => {
                request.session.islogin = 1;
                request.session.user_name = user_name;
                get_data("SELECT * FROM users WHERE email = ?", [email]).then((data2) => {
                    request.session.user_id = data2[0]["id"]
                    request.session.email = email;
                    request.session.cart = [];
                    request.session.like = [];
                    response.redirect("/")
                })
            })
        }
    })
})


app.post("/login", (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    get_data("SELECT * FROM users WHERE email = ?", [email]).then((data) => {
        if (data.length > 0) {
            const shaObj = new jsSHA("SHA3-512", "TEXT", {
                encoding: "UTF8",
            });
            shaObj.update(password);
            const hashedPassword = shaObj.getHash("HEX");
            if (hashedPassword == data[0]["password"]) {
                request.session.islogin = 1;
                request.session.user_name = data[0]["name"];
                request.session.email = email;
                request.session.user_id = data[0]["id"]
                request.session.cart = [];
                request.session.like = [];
                response.redirect("/");
            } else {
                request.session.mess = "Неверный пароль"
                response.redirect("/auth")
            }
        } else {
            request.session.mess = "Такой почты не найдено"
            response.redirect("/auth")
        }
    })

})

app.get("/logout", (request, response) => {
    request.session.islogin = 0;
    request.session.user_name = undefined;
    request.session.user_id = undefined;
    response.redirect("/")
})

app.get("/chenge_data", (request, response) => {
    let new_data = {
        data: {

        },
        cart: {},
        islogin: 0
    }
    if (request.session.islogin != 1) {
        let count = 0
        get_data().then((data) => {
            if (request.session.cart.length > 0) {
                for (i in request.session.cart) {
                    for (j in data) {
                        if (count == 3) {
                            break
                        }
                        if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                            new_data["cart"][request.session.cart[i]["product_name"]] = {
                                "img": data[j]["img"]
                            }
                            count++
                        }
                    }
                }
            } else {
                if (Object.keys(new_data["cart"]).length < 1) {
                    new_data["cart"] = false;
                }
            }
            if (request.session.mess) {
                new_data["mess"] = request.session.mess
                request.session.mess = undefined
            } else {
                request.session.mess = false
            }
            response.render("forgot.hbs", new_data);
        })
    } else {
        new_data["islogin"] = request.session.user_name;
        get_data("SELECT product_name, img FROM `cart` JOIN `users` ON user_id = id JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
            let count = 0
            for (i in cart_data) {
                if (count == 3) {
                    break
                }
                new_data["cart"][cart_data[i]["product_name"]] = {
                    "img": cart_data[i]["img"]
                }
                count++
            }
            if (Object.keys(new_data["cart"]).length < 1) {
                new_data["cart"] = false;
            }
            if (request.session.mess) {
                new_data["mess"] = request.session.mess
            } else {
                request.session.mess = false
            }
            response.render("forgot.hbs", new_data);
        })
    }
})

app.post("/chenge_email", (request, response) => {
    let email = request.body.new_email;
    let user_name = request.body.name;
    let password = request.body.password;
    if (email == request.session.email) {
        request.session.mess = "Это ваша нынешняя почта"
        response.redirect("/chenge_data")
    } else if (user_name != request.session.user_name) {
        request.session.mess = "Это неверное имя"
        response.redirect("/chenge_data")
    } else {
        get_data("SELECT * FROM users WHERE email = ?", [request.session.email]).then((data) => {
            const shaObj = new jsSHA("SHA3-512", "TEXT", {
                encoding: "UTF8",
            });
            shaObj.update(password);
            const hashedPassword = shaObj.getHash("HEX");
            if (hashedPassword == data[0]["password"]) {
                get_data("SELECT * FROM users").then((dataS) => {
                    let flag = false;
                    for (i in dataS) {
                        if (dataS[i]["email"] == email) {
                            flag = true;
                            break
                        }
                    }
                    if (flag) {
                        request.session.mess = "Эта почта занята"
                        response.redirect("/chenge_data")
                    } else {
                        insert_data("UPDATE users SET email = ? WHERE id = ?", [email, request.session.user_id]).then((data2) => {
                            request.session.email = email
                            response.redirect("/")
                        })
                    }
                })
            } else {
                request.session.mess = "Неверный пароль"
                response.redirect("/chenge_data")
            }
        })
    }
})


app.post("/chenge_password", (request, response) => {
    let user_name = request.body.name;
    let first_password = request.body.password1;
    let second_password = request.body.password2;
    if (user_name != request.session.user_name) {
        request.session.mess = "Это неверное имя"
        response.redirect("/chenge_data")
    } else if (first_password != second_password) {
        request.session.mess = "Пароли на сходятся"
        response.redirect("/chenge_data")
    } else {
        get_data("SELECT * FROM users WHERE email = ?", [request.session.email]).then((dataP) => {
            const shaObj = new jsSHA("SHA3-512", "TEXT", {
                encoding: "UTF8",
            });
            shaObj.update(first_password);
            const hashedPassword = shaObj.getHash("HEX");
            if (hashedPassword == dataP[0]["password"]) {
                request.session.mess = "Это ненешний пароль"
                response.redirect("/chenge_data")
            } else {
                insert_data("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, request.session.user_id]).then((data2) => {
                    response.redirect("/")
                })
            }
        })
    }
})

app.get("/new_order", (request, response) => {
    let new_data = {
        data: [],
        cart: {},
        islogin: 0,
        summ: 0,
        delivery: 0,
        itogo: 0,
        email: 0
    }
    if (request.session.islogin != 1) {
        let count = 0
        get_data().then((data) => {
            if (request.session.cart.length > 0) {
                for (i in request.session.cart) {
                    for (j in data) {
                        if (count == 3) {
                            break
                        }
                        if (request.session.cart[i]["product_name"] == data[j]["product_name"]) {
                            new_data["cart"][request.session.cart[i]["product_name"]] = {
                                "img": data[j]["img"]
                            }
                            count++
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
                })
                new_data["summ"] += request.session.cart[i]["itog_price"]
            }
            if (new_data["summ"] < 3000) {
                new_data["delivery"] = 690
                new_data["itogo"] = new_data["summ"] + 690
            } else {
                new_data["itogo"] = new_data["summ"]
            }
            response.render("new_order.hbs", new_data)
        })
    } else {
        new_data["islogin"] = request.session.user_name;
        new_data["email"] = request.session.email;
        get_data("SELECT cart_id, id_product, product_name, img, price, compound, raiting, sm_desc, value, weight FROM `cart` JOIN `products` ON product_id = id_product WHERE user_id = ?", [request.session.user_id]).then((cart_data) => {
            for (i in cart_data) {
                new_data["data"].push({
                    "product_name": cart_data[i]["product_name"],
                    "itog_price": cart_data[i]["price"] * cart_data[i]["value"] * (cart_data[i]["weight"] / 100)
                })
                new_data["summ"] += cart_data[i]["price"] * cart_data[i]["value"] * (cart_data[i]["weight"] / 100)
            }
            if (new_data["summ"] < 3000) {
                new_data["delivery"] = 690
                new_data["itogo"] = new_data["summ"] + 690
            } else {
                new_data["itogo"] = new_data["summ"]
            }
            response.render("new_order.hbs", new_data)
        })
    }
})

app.post("/buy", (request, response) => {
    console.log(request.body)
})


app.listen(port, () => {
    console.log('Hello!');
});
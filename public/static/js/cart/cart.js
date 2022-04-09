let weight = $('#weight');
let val = $("#val");
let price = $("#pr1ce");
let lowprice = $("#lowprice");
let start_price = lowprice.text();
start_price = Number(start_price)
weight.on("change", () => {
    let itog = start_price * (Number(weight.val()) / 100) * Number(val.val())
    price.text(itog)
})

val.on("change", () => {
    let itog = start_price * (Number(weight.val()) / 100) * Number(val.val())
    price.text(itog)
})
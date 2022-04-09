let weight = $('#weight');
let val = $("#val");
let price = $("#pr1ce");
let start_price = price.text();
start_price = Number(start_price.slice(0, start_price.length - 2))
weight.on("change", () => {
    let itog = start_price * (Number(weight.val()) / 100) * Number(val.val())
    price.text(itog + " р")
})

val.on("change", () => {
    let itog = start_price * (Number(weight.val()) / 100) * Number(val.val())
    price.text(itog + " р")
})
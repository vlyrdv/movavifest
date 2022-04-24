let wall = document.getElementById("wall");
let sign_up = document.getElementById("sign_up")
let sign_in = document.getElementById("sign_in")
let btn = document.getElementById("btn");
let txt = document.getElementById("txt");
btn.addEventListener("click", () => {
    if (sign_in.classList.contains("active")) {
        sign_in.classList.add("notactive")
        sign_in.classList.remove("active")

        sign_up.classList.remove("notactive")
        sign_up.classList.add("active")

        wall.classList.remove("log")
        wall.classList.add("reg")
        btn.innerHTML = "Сменить пароль";
        txt.innerHTML = "Введите свои данные для смены почты";
    } else if (sign_up.classList.contains("active")) {
        sign_up.classList.add("notactive")
        sign_up.classList.remove("active")

        sign_in.classList.remove("notactive")
        sign_in.classList.add("active")
        wall.classList.remove("reg")
        wall.classList.add("log")
        btn.innerHTML = "Сменить почту";
        txt.innerHTML = "Введите свои данные для смены пароля";
    }
})
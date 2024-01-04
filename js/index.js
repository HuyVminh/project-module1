let status = true;
let btn1 = document.getElementById("dropdown");
let btn2 = document.getElementById("btnlogin");

const show = (status) => {
    if (status == true) {
        btn2.style.display = "block";
        btn1.style.display = "none";
    } else {
        btn1.style.display = "block";
        btn2.style.display = "none";
    }
}
show(true);

function logout() {
    localStorage.setItem("user_login", JSON.stringify(""));
    show(true);
}
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

document.getElementById("drop").addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById("myDropdown").classList.toggle("show");
});
function loadInfo() {
    // lấy id với mảng các người dùng về để tìm thông tin
    const idUserLogin = JSON.parse(localStorage.getItem("user_login"))
    const users = JSON.parse(localStorage.getItem("users"))
    // tìm xem có user ko
    const index = users.findIndex(user => user.user_id == idUserLogin)
    // ko có thì đi login
    if (index == -1) {
        show(true);
        // window.location.href = "/form-login.html"
    } else { // có thì gán thông tin ảnh với tên
        show(false);
        document.getElementById("username").innerHTML = users[index].username;
    }
}
loadInfo()

function loadProductsNew() {
    const products = JSON.parse(localStorage.getItem("products"));
    let stringHTML = ""
    for (let i = 0; i < 8; i++) {
        const element = products[i];
        stringHTML += `
            <div class="productNew" onclick="clickProduct(${element.id})">
                <img src="/img/${element.image}" alt="">
                <div>
                    <p class="info">${element.name}</p>
                    <span class="price">${Number(element.price).toLocaleString('vi-VN')} <u>đ</u></span>
                </div>
            </div>`
    }
    document.getElementById("productsNewList").innerHTML = stringHTML;
}
loadProductsNew();

function loadProductsHot() {
    const products = JSON.parse(localStorage.getItem("products"));
    let strHTML = ""
    for (let i = 0; i < 4; i++) {
        const element = products[i];
        strHTML += `
            <div class="productNew" onclick="clickProduct(${element.id})">
                <img src="/img/${element.image}" alt="">
                <div>
                    <p class="info">${element.name}</p>
                    <span class="price">${Number(element.price).toLocaleString('vi-VN')} <u>đ</u></span>
                </div>
            </div>`
    }
    document.getElementById("productHot").innerHTML = strHTML;
}
loadProductsHot();

function clickProduct(id) {
    const products = JSON.parse(localStorage.getItem("products"));
    const index = products.findIndex(product => product.id == id);
    let item = products[index];
    localStorage.setItem("product-info", JSON.stringify(item));
    location.href = "/product-info.html";
}

function loadCart() {
    const idUserLogin = JSON.parse(localStorage.getItem("user_login"));
    const users = JSON.parse(localStorage.getItem("users"));
    // tìm xem có user ko
    const index = users.findIndex(user => user.user_id == idUserLogin);
    // ko có thì đi login
    if (index == -1) {
        alert("Hãy đăng nhập để truy cập giỏ hàng !");
    } else {
        location.href = "./cart.html";
    }
}
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
    location.href = "./index.html";
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

function showCart() {

    let idUserLogin = JSON.parse(localStorage.getItem("user_login"));
    let users = JSON.parse(localStorage.getItem("users"));
    let index = users.findIndex(user => user.user_id == idUserLogin);

    const cart = users[index].cart
    let total = 0
    if (cart.length == 0) {
        document.getElementById("list-cart").innerHTML = `<tr><td colspan="5" style="text-align:center;"><i>Giỏ hàng đang trống !</i></td></tr>`;
    } else {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        let stringHTML = "";
        cart.forEach(element => {
            let indexProduct = products.findIndex(product => product.id == element.idProduct);
            let product = products[indexProduct];
            total += product.price * element.quantity;
            stringHTML +=
                `
            <tr>
                <td style="width: 70px;">
                    <img src="/img/${product.image}" alt="" width="60px" height="60px">
                </td>
                <td scope="row" style="text-align: left;">${product.name}</td>
                <td style="text-align: end;">${Number(product.price).toLocaleString('vi-VN')} đ</td>
                <td style="text-align: center;"><button class="decrement" onclick="decrementQuantity(${element.idProduct})">-</button>&emsp;${element.quantity}&emsp;<button class="increment" onclick="incrementQuantity(${element.idProduct})">+</button></td>
                <td><i class="fa-solid fa-trash" onclick="delItem(${element.idProduct})"></i></td>
            </tr>
        `
        });
        document.getElementById("list-cart").innerHTML = stringHTML;
        document.getElementById("username-buy").innerHTML = users[index].fullname;
        document.getElementById("email-buy").innerHTML = users[index].email;
        document.getElementById("total-cash1").innerText = `${Number(total).toLocaleString('vi-VN')} đ`;
        document.getElementById("total-cash2").innerText = `${Number(total).toLocaleString('vi-VN')} đ`;
    }
}
showCart();

function incrementQuantity(productId) {
    let idUserLogin = JSON.parse(localStorage.getItem("user_login"));
    let users = JSON.parse(localStorage.getItem("users"));
    let index = users.findIndex(user => user.user_id == idUserLogin);

    let cart = users[index].cart;
    let productIndex = cart.findIndex(item => item.idProduct == productId);
    let product = cart[productIndex];

    product.quantity++;

    users[index].cart = cart;
    localStorage.setItem("users", JSON.stringify(users));

    showCart();
}

function decrementQuantity(productId) {
    let idUserLogin = JSON.parse(localStorage.getItem("user_login"));
    let users = JSON.parse(localStorage.getItem("users"));
    let index = users.findIndex(user => user.user_id == idUserLogin);

    let cart = users[index].cart;
    let productIndex = cart.findIndex(item => item.idProduct == productId);
    let product = cart[productIndex];

    if (product.quantity > 1) {
        product.quantity--;
    } else {
        cart.splice(productIndex, 1);
    }

    users[index].cart = cart;
    localStorage.setItem("users", JSON.stringify(users));

    showCart();
}

function delItem(productId) {
    let idUserLogin = JSON.parse(localStorage.getItem("user_login"));
    let users = JSON.parse(localStorage.getItem("users"));
    let index = users.findIndex(user => user.user_id == idUserLogin);

    let cart = users[index].cart;
    let productIndex = cart.findIndex(item => item.idProduct == productId);
    cart.splice(productIndex, 1);
    users[index].cart = cart;
    localStorage.setItem("users", JSON.stringify(users));
    showCart();
}

// tạo hóa đơn
let orders = JSON.parse(localStorage.getItem("orders")) || [];

const handleCheckOut = () => {
    let order_details = [];
    let products = JSON.parse(localStorage.getItem("products"));
    let total = 0;
    let idUserLogin = JSON.parse(localStorage.getItem("user_login"));
    let users = JSON.parse(localStorage.getItem("users"));
    let index = users.findIndex(user => user.user_id == idUserLogin);
    let userLogin = users[index];
    for (let i = 0; i < userLogin.cart.length; i++) {
        const element = userLogin.cart[i];
        let product = products.find(pro => pro.id == element.idProduct);
        total += product.price * element.quantity;
        let order_detail = {
            id: element.idProduct,
            name: product.name,
            quantity: element.quantity,
            price: product.price,
        }
        order_details.push(order_detail);
    }

    let user_fullname = users[index].fullname;
    let order_at = new Date().toLocaleString();
    let status = 1;
    let note = document.getElementById("note").value;

    let newOrder = {
        order_id: getNewId(),
        user_fullname,
        order_at,
        total,
        status,
        note,
        order_details,
    }

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    userLogin.cart = [];
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đã đặt hàng thành công !");
    location.reload();
}

// tạo id tự tăng
const getNewId = () => {
    let idMax = 0;
    for (let i = 0; i < orders.length; i++) {
        const element = orders[i];
        if (idMax < element.order_id) {
            idMax = element.order_id;
        }
    }
    return idMax + 1;
}

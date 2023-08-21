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

function loadItem() {
    const item = JSON.parse(localStorage.getItem("product-info"));
    let str = `
        <div class="item-img">
            <h5>${item.name}</h5>
            <img src="/img/${item.image}" alt="">
        </div>
        <div class="item-info">
            <div>
                <h5>Thông tin sản phẩm :</h5>
            </div>
            <div>
                <p>${item.info}</p>
            </div>
            <div class="count">
                <span id="priceitem">${Number(item.price).toLocaleString('vi-VN')} đ</span>&emsp;&emsp;&emsp;
                <button id="decrement">-</button>
                <input type="number" id="numberInput" value="1" readonly>
                <button id="increment">+</button>
            </div>
            <div class="cartbtn">
                <button onclick="addCart(${item.id})">THÊM VÀO GIỎ HÀNG</button>
            </div>
        </div>`;
    document.getElementById("item-info").innerHTML = str;
}
loadItem();

// Lấy đối tượng các nút và trường nhập liệu theo id
const decrementButton = document.getElementById('decrement');
const incrementButton = document.getElementById('increment');
const numberInput = document.getElementById('numberInput');

// Gắn sự kiện click cho nút giảm
decrementButton.addEventListener('click', function () {
    // Giảm giá trị trường nhập liệu
    if (numberInput.value > 1) {
        numberInput.value = parseInt(numberInput.value) - 1;
    } else if (numberInput.value == 1) {
        numberInput.value = 1;
    }
});

// Gắn sự kiện click cho nút tăng
incrementButton.addEventListener('click', function () {
    // Tăng giá trị trường nhập liệu
    numberInput.value = parseInt(numberInput.value) + 1;
});

function addCart(idPro) {
    let idUserLogin = JSON.parse(localStorage.getItem("user_login"));
    let users = JSON.parse(localStorage.getItem("users"));
    let index = users.findIndex(user => user.user_id == idUserLogin);
    let userLogin = users[index];

    let item = JSON.parse(localStorage.getItem("product-info"));

    if (idUserLogin == "") {
        alert("Vui lòng đăng nhập đề xem giở hàng");
        location.href = "/form-login.html";
    }

    let quantity = +document.getElementById("numberInput").value;
    let indexCartItem = userLogin.cart.findIndex((cartIt) => cartIt.idProduct == idPro);
    console.log(indexCartItem);
    if (indexCartItem > -1) {
        userLogin.cart[indexCartItem].quantity += quantity;
    } else {
        userLogin.cart.push({
            idProduct: item.id,
            quantity
        });
    }
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đã thêm vào giỏ hàng thành công !");
}
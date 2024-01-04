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

document.getElementById("drop").addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById("myDropdown").classList.toggle("show");
});

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

let products = JSON.parse(localStorage.getItem("products"));

// tính toán tổng số trang

let totalProduct = products.length; // tổng số sp
let count = 9;// số sp trên 1 trang
let pageCurrent = 0;
let totalPage = Math.ceil(totalProduct / count); // tổng số trang
console.log(totalPage);


// đổ ra giao diện
const showPagination = () => {
    let links = "";
    for (let i = 0; i < totalPage; i++) {
        links += `<li class="page-item ${i == pageCurrent ? 'active' : ''}" onclick="handlePagination(${i})"><a class="page-link">${i + 1}</a></li>`
    }

    document.querySelector(".pagination").innerHTML = `${links}`;
}

// phần trang  : số trang hiện tại / số phần tử trên 1 trang
const handlePagination = (page = 0) => {
    pageCurrent = page;
    // products.sort((a, b) => a.id - b.id);
    let productPaginate = products.filter((product, index) => (index >= (pageCurrent * count) && index < (pageCurrent + 1) * count))
    console.log(productPaginate);
    loadProducts(productPaginate);
    showPagination();
}
showPagination();

function loadProducts(data = products) {
    let stringHTML = ""
    data.forEach(product => {
        stringHTML += `
            <div class="productNew" onclick="clickProduct(${product.id})">
                <img src="/img/${product.image}" alt="">
            <div>
                <p class="info">${product.name}</p>
                <span class="price">${Number(product.price).toLocaleString('vi-VN')} <u>đ</u></span>
            </div>
            </div > `
    });
    document.getElementById("product_list").innerHTML = stringHTML;
}
// loadProducts();
handlePagination();

function loadCategory() {
    let cat = JSON.parse(localStorage.getItem("categories"));
    let str = ""
    cat.forEach(category => { str += `<div onclick="filterCategory(${category.id})">${category.name}</div >` });
    document.getElementById("catagory_list").innerHTML = str;
}
loadCategory();

function filterCategory(id) {
    let categories = JSON.parse(localStorage.getItem("categories"));
    const index = categories.findIndex(category => category.id == id);
    const catSearch = categories[index].name;
    // lọc ra những người mình cần tìm
    const arrProduct = products.filter(product => product.category.includes(catSearch));
    // vẽ lại giao diện
    document.getElementById("category_name").innerHTML = catSearch.toUpperCase();
    loadProducts(arrProduct);
}

function clickProduct(id) {
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


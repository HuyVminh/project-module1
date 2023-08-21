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

function logout() {
    localStorage.setItem("admin_login", JSON.stringify(""));
    window.location.href = "/form-login.html";
};

// ===================================================================================
// ===================================================================================

let idUpdateGlobal = null // dùng để lưu id ai đang cần chỉnh sửa
let categories = JSON.parse(localStorage.getItem("categories")) || [];
const getCategoryNameById = (id) => {
    return category_list.find((cat) => cat.category_id == id).name;
}

// khai báo liên kết js với các ô input và thông báo lỗi
const nameHTML = document.getElementById("name");
const infoHTML = document.getElementById("info");
const priceHTML = document.getElementById("price");
const quantityHTML = document.getElementById("quantity");
const catagoryHTML = document.getElementById("catagory");
const imageHTML = document.getElementById("image");

function loadInfo() {
    // lấy id với mảng các người dùng về để tìm thông tin
    const idAdminLogin = JSON.parse(localStorage.getItem("admin_login"));
    const users = JSON.parse(localStorage.getItem("users"));
    // tìm xem có user ko
    const index = users.findIndex(user => user.user_id == idAdminLogin);
    // ko có thì đi login
    if (index == -1) {
        window.location.href = "/form-login.html";
    } else { // có thì gán thông tin ảnh với tên
        document.getElementById("username").innerHTML = users[index].username;
    }
};

loadInfo();

const products = JSON.parse(localStorage.getItem("products"));
let totalProduct = products.length; // tổng số sp
let count = 10;// số sp trên 1 trang
let pageCurrent = 0;
let totalPage = Math.ceil(totalProduct / count); // tổng số trang

// đổ ra giao diện
const showPagination = () => {
    let links = "";
    for (let i = 0; i < totalPage; i++) {
        links += `<a class="${i == pageCurrent ? 'active' : ''}" onclick="handlePagination(${i})">${i + 1}</a>`
    }

    document.querySelector(".pagination").innerHTML = `${links}`;
}

// phần trang  : số trang hiện tại / số phần tử trên 1 trang
const handlePagination = (page = 0) => {
    const products = JSON.parse(localStorage.getItem("products"));
    pageCurrent = page;
    // products.sort((a, b) => a.id - b.id);
    let productPaginate = products.filter((product, index) => (index >= (pageCurrent * count) && index < (pageCurrent + 1) * count))
    console.log(productPaginate);
    loadProducts(productPaginate);
    showPagination();
}

function loadProducts(data) {
    const products = JSON.parse(localStorage.getItem("products"));
    // nếu ko có data(- lúc gọi loadUsers() -) thì dùng users để vẽ tất cả user
    if (!data) {
        const textSearch = document.getElementById("search").value.trim();
        // lọc ra những người mình cần tìm
        data = products.filter(product => product.name.toLowerCase().includes(textSearch));
    }

    // nối chuỗi để in ra
    let stringHTML = ""
    data.forEach(product => {
        stringHTML +=
            `
            <tr>
                <td>${product.id}</td>
                <td><img src="/img/${product.image}" alt="image" width="60px" height: "60px"></td>
                <td style="width: 200px;">${product.name}</td>
                <td>${product.category}</td>
                <td style="width: 300px;">${product.info.substring(0,100)}</td>
                <td style="text-align: end;">${Number(product.price).toLocaleString('vi-VN')}</td>
                <td style="width: 50px;">${product.stock}</td>
                <td><button style="background-color: rgb(47, 189, 245);" onclick="clickUpdate(${product.id})">Sửa</button></td>
                <td><button style="background-color: rgb(189, 67, 37);" onclick="deleteProduct(${product.id})">Xóa</button></td>
            </tr>
        `
    });
    document.getElementById("list").innerHTML = stringHTML;
    showPagination();
}
handlePagination();

document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault()

    const products = JSON.parse(localStorage.getItem("products"));

    if (idUpdateGlobal != null) {
        const index = products.findIndex(product => product.id == idUpdateGlobal);
        products[index].name = nameHTML.value;
        products[index].info = infoHTML.value;
        products[index].price = priceHTML.value;
        products[index].stock = quantityHTML.value;
        products[index].category = catagoryHTML.value;
        if (imageHTML.value) {
            let image = imageHTML.value;
            image = image.split("\\");
            image = image[image.length - 1];
            products[index].image = image;
        }

        localStorage.setItem("products", JSON.stringify(products));
        this.reset();
        loadProducts();
        showPagination();
        idUpdateGlobal = null;
        return;
    }

    let image = imageHTML.value;
    image = image.split("\\");
    image = image[image.length - 1];

    const newProduct = {
        id: getNewID(products),
        name: nameHTML.value,
        info: infoHTML.value,
        image: image,
        price: priceHTML.value,
        stock: quantityHTML.value,
        category: catagoryHTML.value,
    };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    this.reset();
    handlePagination();
    showPagination();
    location.reload();
})

function deleteProduct(id) {
    const products = JSON.parse(localStorage.getItem("products"))

    const index = products.findIndex(product => product.id == id)

    if (index == -1) {
        alert("Không tìm thấy sản phẩm !")
    } else {
        const result = confirm("Bạn có chắc muốn xóa !")
        if (!result) {
            return;
        }
        products.splice(index, 1)
        localStorage.setItem("products", JSON.stringify(products))
        handlePagination();
        showPagination();
        // location.reload();
    }
}

function getNewID(products) {
    let idMax = 0;
    for (let i = 0; i < products.length; i++) {
        const element = products[i];
        if (idMax < element.id) {
            idMax = element.id;
        }
    }
    return idMax + 1;
}

function clickUpdate(id) {
    const products = JSON.parse(localStorage.getItem("products"))

    const index = products.findIndex(product => product.id == id)

    if (index == -1) {
        alert("Không tìm thấy User !")
    } else {
        idUpdateGlobal = id;
        nameHTML.value = products[index].name;
        infoHTML.value = products[index].info;
        priceHTML.value = products[index].price;
        quantityHTML.value = products[index].stock;
        catagoryHTML.value = products[index].category;
    }
}

function search() {
    // lấy thông tin từ database
    const products = JSON.parse(localStorage.getItem("products"));
    const textSearch = document.getElementById("search").value.trim();
    // lọc ra những người mình cần tìm
    const arrProduct = products.filter(product => product.name.toLowerCase().includes(textSearch));
    // vẽ lại giao diện
    loadProducts(arrProduct);
    showPagination();
}

// đổ danh mục ra
let strCategory = "";
for (let i = 0; i < categories.length; i++) {
    const element = categories[i];
    strCategory += `<option value="${element.name}">${element.name}</option>`
}
document.getElementById("catagory").innerHTML = strCategory;

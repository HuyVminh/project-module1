/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
document.getElementById("drop").addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById("myDropdown").classList.toggle("show");
});
// Close the dropdown if the user clicks outside of it
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
}
function logout() {
    localStorage.setItem("admin_login", JSON.stringify(""));
    window.location.href = "./form-login.html";
}
function loadInfo() {
    // lấy id với mảng các người dùng về để tìm thông tin
    const idAdminLogin = JSON.parse(localStorage.getItem("admin_login"))
    const users = JSON.parse(localStorage.getItem("users"))
    // tìm xem có user ko
    const index = users.findIndex(user => user.user_id == idAdminLogin)
    // ko có thì đi login
    if (index == -1) {
        window.location.href = "./form-login.html"
    } else { // có thì gán thông tin ảnh với tên
        document.getElementById("username").innerHTML = users[index].username;
    }
}
loadInfo()

const nameHTML = document.getElementById("name");
const infoHTML = document.getElementById("info");
let idUpdateGlobal = null;
const categories = JSON.parse(localStorage.getItem("categories")) || [];
let totalCategory = categories.length; // tổng số sp
let count = 10;// số sp trên 1 trang
let pageCurrent = 0;
let totalPage = Math.ceil(totalCategory / count); // tổng số trang

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
    pageCurrent = page;
    // products.sort((a, b) => a.id - b.id);
    let categoriPaginate = categories.filter((categori, index) => (index >= (pageCurrent * count) && index < (pageCurrent + 1) * count))
    console.log(categoriPaginate);
    loadCategory(categoriPaginate);
    showPagination();
}
showPagination();


function loadCategory(data=categories) {
    // nếu ko có data(- lúc gọi loadUsers() -) thì dùng users để vẽ tất cả user
    if (!data) {
        const textSearch = document.getElementById("search").value.trim();
        // lọc ra những người mình cần tìm
        data = categories.filter(category => category.name.toLowerCase().includes(textSearch));
    }

    // nối chuỗi để in ra
    let stringHTML = ""
    data.forEach(category => {
        stringHTML += `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td><button style="background-color: rgb(47, 189, 245);" onclick="clickUpdate(${category.id})">Sửa</button></td>
                <td><button style="background-color: rgb(189, 67, 37);"onclick="deleteCategory(${category.id})">Xóa</button></td>
            </tr>`
    });
    document.getElementById("list").innerHTML = stringHTML;
}

handlePagination();

function getNewID(categories) {
    let idMax = 0;
    for (let i = 0; i < categories.length; i++) {
        const element = categories[i];
        if (idMax < element.id) {
            idMax = element.id;
        }
    }
    return idMax + 1;
}

function findCategory() {
    // lấy thông tin từ database
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const textSearch = document.getElementById("search").value.trim();
    // lọc ra những người mình cần tìm
    const arrCategory = categories.filter(category => category.name.toLowerCase().includes(textSearch));
    // vẽ lại giao diện
    loadCategory(arrCategory);
}

document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault()

    if (idUpdateGlobal != null) {
        const index = categories.findIndex(category => category.id == idUpdateGlobal);
        categories[index].name = nameHTML.value;
        categories[index].description = infoHTML.value;

        localStorage.setItem("categories", JSON.stringify(categories));
        this.reset();
        loadCategory();
        idUpdateGlobal = null;
        return;
    }
    const newCategory = {
        id: getNewID(categories),
        name: nameHTML.value,
        description: infoHTML.value,
    };
    categories.push(newCategory);
    localStorage.setItem("categories", JSON.stringify(categories));
    this.reset();
    loadCategory();
})

function deleteCategory(id) {
    const index = categories.findIndex(category => category.id == id);

    if (index == -1) {
        alert("Không tìm thấy Danh mục !");
    } else {
        const result = confirm("Bạn có chắc muốn xóa !");
        if (!result) {
            return;
        }
        categories.splice(index, 1);
        localStorage.setItem("categories", JSON.stringify(categories));
        loadCategory();
    }
}

function clickUpdate(id) {
    const index = categories.findIndex(catagory => catagory.id == id);

    if (index == -1) {
        alert("Không tìm thấy User !");
    } else {
        idUpdateGlobal = id;
        nameHTML.value = categories[index].name;
        infoHTML.value = categories[index].description;
    }
}
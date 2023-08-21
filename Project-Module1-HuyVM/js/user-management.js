// khai báo các biến global để lưu thông tin toàn hình
let idUpdateGlobal = null // dùng để lưu id ai đang cần chỉnh sửa

// khai báo liên kết js với các ô input và thông báo lỗi
const userNameHTML = document.getElementById("usename")
const fullNameHTML = document.getElementById("fullname")
const emailHTML = document.getElementById("email")
const passwordHTML = document.getElementById("password")
const confirmPasswordHTML = document.getElementById("confirmpassword")
const roleHTML = document.getElementById("role")

const errUsername = document.getElementById("err_username")
const errEmail = document.getElementById("err_email")
const errPassword = document.getElementById("err_password")
const errConfirmPassword = document.getElementById("err_confirmpassword")

// hiển thị thông tin tài khoản đăng nhập
function loadInfo() {
    // lấy id với mảng các người dùng về để tìm thông tin
    const idAdminLogin = JSON.parse(localStorage.getItem("admin_login"));
    const users = JSON.parse(localStorage.getItem("users"));
    // tìm xem có user ko
    const index = users.findIndex(user => user.user_id == idAdminLogin);
    // ko có thì đi login
    if (index == -1) {
        window.location.href = "../index.html"
    } else { // có thì gán thông tin ảnh với tên
        document.getElementById("usernameLog").innerHTML = users[index].username;
    }
}
loadInfo()

const users = JSON.parse(localStorage.getItem("users"));
let totalProduct = users.length; // tổng số sp
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
    pageCurrent = page;
    // products.sort((a, b) => a.id - b.id);
    let userPaginate = users.filter((user, index) => (index >= (pageCurrent * count) && index < (pageCurrent + 1) * count))
    console.log(userPaginate);
    loadUsers(userPaginate);
    showPagination();
}
showPagination();

// hiển thị bảng thông tin người dùng dựa trên data truyền vào
function loadUsers(data = users) {

    // nếu ko có data(- lúc gọi loadUsers() -) thì dùng users để vẽ tất cả user
    if (!data) {
        const textSearch = document.getElementById("search").value.trim()
        // lọc ra những người mình cần tìm
        data = users.filter(user => user.username.toLowerCase().includes(textSearch))
    }

    // nối chuỗi để in ra
    let stringHTML = "";
    data.forEach(user => {
        stringHTML +=
            `
            <tr>
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>${user.fullname}</td>
                <td>${user.email}</td>
                <td>${user.role == 1 ? "Admin" : "User"}</td>
                <td><button style="background-color: rgb(47, 189, 245);" onclick="clickUpdate(${user.user_id})">Sửa</button></td>
                <td><button style="background-color: rgb(189, 67, 37);" onclick="deleteUser(${user.user_id})">Xóa</button></td>
            </tr>
        `
    });
    document.getElementById("list").innerHTML = stringHTML;
}
handlePagination();
// loadUsers();

// tìm kiếm
function search() {
    // lấy thông tin từ database
    const users = JSON.parse(localStorage.getItem("users"))
    const textSearch = document.getElementById("search").value.trim()
    // lọc ra những người mình cần tìm
    const arrUser = users.filter(user => user.username.toLowerCase().includes(textSearch))
    // vẽ lại giao diện
    loadUsers(arrUser)
}

// thêm
document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault()

    if (idUpdateGlobal != null) {
        const index = users.findIndex(user => user.user_id == idUpdateGlobal)
        users[index].role = Number(roleHTML.value)
        localStorage.setItem("users", JSON.stringify(users))
        this.reset()
        loadUsers()
        idUpdateGlobal = null

        userNameHTML.readOnly = false
        fullNameHTML.readOnly = false
        emailHTML.readOnly = false
        passwordHTML.readOnly = false

        return
    }


    const newUser = {
        user_id: getNewID(users),
        username: userNameHTML.value,
        fullname: fullNameHTML.value,
        email: emailHTML.value,
        password: passwordHTML.value,
        role: roleHTML.value,
        cart: [],
    }
    const check = checkInfo(newUser)
    if (check) {
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
        this.reset()
        loadUsers()
    }
})

// xóa
function deleteUser(user_id) {

    const index = users.findIndex(user => user.user_id == user_id)

    if (index == -1) {
        alert("Không tìm thấy User !")
    } else {
        if (users[index].role == 0) {
            const result = confirm("Bạn có chắc muốn xóa !")
            if (!result) {
                return
            }
            users.splice(index, 1)
            localStorage.setItem("users", JSON.stringify(users))
            loadUsers()
        } else {
            alert("không được xóa ")
        }
    }
}

// click sửa
function clickUpdate(user_id) {

    const index = users.findIndex(user => user.user_id == user_id)

    if (index == -1) {
        alert("Không tìm thấy User !")
    } else {
        idUpdateGlobal = user_id
        userNameHTML.value = users[index].username
        fullNameHTML.value = users[index].fullname
        emailHTML.value = users[index].email
        passwordHTML.value = users[index].password
        roleHTML.value = users[index].role

        userNameHTML.readOnly = true
        fullNameHTML.readOnly = true
        emailHTML.readOnly = true
        passwordHTML.readOnly = true
    }
}


// kiểm tra thông tin nhập lúc thêm
function checkInfo(user) {
    const { userName, password, confirmPassword } = user;

    const regexName = /^(?=.*[a-zA-Z0-9 ])[a-zA-Z0-9 ]{6,}$/;
    const regexPassword = /^(?=.*[a-z])(?=.*\d)[^\s]{6,}$/;

    let check = true;

    if (!regexName.test(userNameHTML.value)) {
        errUsername.innerHTML = "Ít nhất 6 ký tự";
        check = false;
    } else {
        errUsername.innerHTML = "";
    }

    if (!regexPassword.test(passwordHTML.value)) {
        errPassword.innerHTML = "Ít nhất: 1 số và có trên 6 ký tự";
        check = false;
    } else {
        errPassword.innerHTML = "";

        if (confirmPasswordHTML.value !== passwordHTML.value) {
            errConfirmPassword.innerHTML = "Xác nhận lại mật khẩu";
            check = false;
        } else {
            errConfirmPassword.innerHTML = "";
        }
    }

    return check;

}

document.getElementById("drop").addEventListener("click", function (event) {
    event.stopPropagation();
    document.getElementById("myDropdown").classList.toggle("show");
});

function logout() {
    localStorage.setItem("admin_login", JSON.stringify(""));
    window.location.href = "/form-login.html";
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
}

function getNewID(users) {
    let idMax = 0;
    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        if (idMax < element.user_id) {
            idMax = element.user_id;
        }
    }
    return idMax + 1;
}
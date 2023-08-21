let wrapper = document.querySelector(".wrapper");
let loginLink = document.querySelector(".login-link");
let registerLink = document.querySelector(".register-link");
registerLink.addEventListener("click", function (e) {
    e.preventDefault()
    wrapper.classList.add("active");
});
loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

// lay thong tin tu form dang ky
let useName = document.getElementById("input_name");
let password = document.getElementById("input_pass");
let email = document.getElementById("input_email");
let inputconfirm = document.getElementById("input_confirm");
let fullName = document.getElementById("input_fullname");

let warnR = document.getElementById("warningreg");
let warnL = document.getElementById("warninglog");

let loginname = document.getElementById("login_name");
let loginpass = document.getElementById("login_pass");

function register() {
    if (!useName.value || !password.value || !email.value || !inputconfirm.value || !fullName.value) {
        warnR.innerHTML = "Không được để trống !";
    }
    else if (!validateEmail(email.value)) {
        warnR.innerHTML = "Email nhập chưa đúng định dạng !"
    }
    else if (!validatePassword(password.value)) {
        warnR.innerHTML = "Mật khẩu bao gồm ít nhất 1 chữ số và tối thiểu 6 ký tự !"
    }
    else if (password.value !== inputconfirm.value) {
        warnR.innerHTML = "Mật khẩu chưa trùng khớp !";
    }
    
    else {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let index1 = users.findIndex(user => user.email == email.value);
        let index2 = users.findIndex(user => user.username == useName.value);
        if (index1 != -1 || index2 != -1) {
            warnR.innerHTML = "Tài khoản này đã tồn tại";
        } else {
            let newUser = {
                user_id: getNewID(users),
                username: useName.value,
                fullname: fullName.value,
                email: email.value,
                password: password.value,
                role: 0,
                cart: [],
            };
            console.log(newUser);
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            warnR.innerHTML = "Tạo tài khoản thành công";
            useName.value = "";
            fullName.value = "";
            email.value = "";
            password.value = "";
            inputconfirm.value = "";
        }
    }
}
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault()
    let users = JSON.parse(localStorage.getItem("users"));

    let check = false;
    let index;
    for (let i = 0; i < users.length; i++) {
        if (loginname.value == users[i].username && loginpass.value == users[i].password) {
            check = true;
            index = i;
            break;
        }
    }
    if (check) {
        if (users[index].role == 0) {
            localStorage.setItem("user_login", JSON.stringify(users[index].user_id));
            window.location.href = "/index.html";
        } else {
            localStorage.setItem("admin_login", JSON.stringify(users[index].user_id));
            window.location.href = "/product-management.html";
        }

    } else {
        warnL.innerHTML = "Tài khoản hoặc mật khẩu không đúng !";
    }
});

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

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}
// hàm validate pass 

const validatePassword = (pass) => {
    return String(pass)
        .toLowerCase()
        .match(/^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/);
}
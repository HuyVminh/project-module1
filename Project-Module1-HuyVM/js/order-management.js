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
    window.location.href = "/form-login.html";
}
function loadInfo() {
    // lấy id với mảng các người dùng về để tìm thông tin
    const idAdminLogin = JSON.parse(localStorage.getItem("admin_login"))
    const users = JSON.parse(localStorage.getItem("users"))
    // tìm xem có user ko
    const index = users.findIndex(user => user.user_id == idAdminLogin)
    // ko có thì đi login
    if (index == -1) {
        window.location.href = "/form-login.html"
    } else { // có thì gán thông tin ảnh với tên
        document.getElementById("username").innerHTML = users[index].username;
    }
}
loadInfo()

//hiển thị toàn bộ đơn hàng theo thứ tự ngày gần nhất trước

//lấy danh sách đơn hàng

// hiển thị trạng thái theo mã trạng thái
const handleStatusOrder = (statusCode) => {
    switch (statusCode) {
        case 1:
            return `<button style="background-color: grey; color: #fff;border-radius:10px;padding:10px">Đang chờ xác nhận...</button>`;
        case 2:
            return `<button style="background-color: green; color: #fff;border-radius:10px;padding:10px">Đã xác nhận</button>`;
        case 3:
            return `<button style="background-color: red; color: #fff;border-radius:10px;padding:10px">Bị từ chối</button>`;
    }
}

const showOrders = () => {
    orders = JSON.parse(localStorage.getItem("orders")) || [];
    // list.sort((a, b) => b.order_at.localcompare(a.order_at));
    let string1 = orders.reduce((str, value) => str + `<tr>
                                                        <td>${value.order_id}</td>
                                                        <td>${value.user_fullname}</td>
                                                        <td style="text-align: end;">${Number(value.total).toLocaleString('vi-VN')} đ</td>
                                                        <td>${value.order_at}</td>
                                                        <td>${handleStatusOrder(value.status)}</td>
                                                        <td><button style="background-color: rgb(47, 189, 245);" onclick="showOrderDetail(${value.order_id})">Xem</button></td>
                                                    </tr>`, "");
    document.getElementById("list").innerHTML = string1;

}
showOrders();

function showOrderDetail(id) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    let index = orders.findIndex((od) => od.order_id == id);
    let value = orders[index];
    let string1 = `<p>Chi tiết đơn hàng</p>
                    <div class="detailinfo">
                        <span>Mã đơn hàng :&emsp;</span><span class="info-user">${value.order_id}</span>&emsp;
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                        <button onclick="accept(${value.order_id})" class="${value.status == 1 ? "" : "not_click"}" style="background-color: orange; cursor: pointer; margin-bottom: 10px; position: relactive;">Xác nhận</button><br>     
                        <span>Họ và tên người đặt hàng :&emsp;
                        </span><span class="info-user">${value.user_fullname}</span>
                        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                        <button onclick="cancel(${value.order_id})" class="${value.status == 1 ? "" : "not_click"}" style = "background-color: brown; cursor: pointer;" >Từ chối</button ><br>
                        <span>Ghi chú :&emsp;
                        </span><span class="info-user">${value.note}</span><br>
                        <span>Thời gian tạo đơn đặt hàng :&emsp;
                        </span><span class="info-user">${value.order_at}</span><br>
                    </div>`;
    document.getElementById("orderdetails").innerHTML = string1;
    let list = orders[index].order_details;
    let string2 = list.reduce((str, value) => str + `<tr>
                                                        <td>${value.id}</td>
                                                        <td>${value.name}</td>
                                                        <td>${value.quantity}</td>
                                                        <td style="text-align:end;">${Number(value.price).toLocaleString('vi-VN')} đ</td>
                                                        <td style="text-align:end;">${Number(value.quantity * value.price).toLocaleString('vi-VN')} đ</td>
                                                    </tr>`, "");
    let string3 = `<thead>
                        <tr>
                            <th>ID sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>${string2}</tbody>`
    document.getElementById("order_detail").innerHTML = string3;
}

function accept(id) {
    const orders = JSON.parse(localStorage.getItem("orders"));
    const index = orders.findIndex(e => e.order_id == id);
    orders[index].status = 2;
    localStorage.setItem("orders", JSON.stringify(orders));
    showOrders();
    location.reload();
}
function cancel(id) {
    const orders = JSON.parse(localStorage.getItem("orders"));
    const index = orders.findIndex(e => e.order_id == id);
    orders[index].status = 3;
    localStorage.setItem("orders", JSON.stringify(orders));
    showOrders();
    location.reload();
}
function search() {
    // lấy thông tin từ database
    const orders = JSON.parse(localStorage.getItem("orders"));
    const textSearch = document.getElementById("search").value.trim();
    // lọc ra những người mình cần tìm
    const arrOrder = orders.filter(order => order.user_fullname.toLowerCase().includes(textSearch));
    // vẽ lại giao diện
    showOrders(arrOrder);
}
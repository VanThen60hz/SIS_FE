export const findAll = async (pageNumber, pageSize) => {
    try {
        let response = await axios.get(
            `http://localhost:8080/merge-person?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        );
        return response.data; // Access the array in the 'data' property of the 'data' object
    } catch (e) {
        console.log(e);
    }
};

const fetchDataAndAddToTable = async (pageNumber, pageSize) => {
    const data = await findAll(pageNumber, pageSize);

    const currentPersonsElement = document.getElementById("current-persons");
    const totalSizeElement = document.getElementById("total-size");

    currentPersonsElement.innerText = `${(pageNumber - 1) * 10 + 1} - ${
        pageNumber * 10 + 1
    }`;
    totalSizeElement.innerText = data.total_size;

    addListToTable(data.data, "data");
};

export const addListToTable = (list, tableId) => {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = "";
    if (tbody) {
        const headerRow = document.createElement("tr");

        // Thêm các cột từ dữ liệu trong đối tượng đầu tiên của danh sách list
        Object.keys(list[0]).forEach((key) => {
            const th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
        });

        // Thêm cột "Edit" và "Delete" vào tiêu đề
        const editTh = document.createElement("th");
        editTh.textContent = "Edit";
        headerRow.appendChild(editTh);

        const deleteTh = document.createElement("th");
        deleteTh.textContent = "Delete";
        headerRow.appendChild(deleteTh);

        tbody.appendChild(headerRow);

        // Thêm dữ liệu từ danh sách vào bảng
        list.forEach((item) => {
            const tr = document.createElement("tr");

            // Thêm các ô dữ liệu từ mỗi item
            Object.values(item).forEach((value) => {
                const td = document.createElement("td");
                td.textContent = value !== null ? value : "";
                tr.appendChild(td);
            });

            // Tạo nút "Edit" và "Delete" bọc trong thẻ <a> có class của Bootstrap
            const editTd = document.createElement("td");
            const editLink = document.createElement("a");
            editLink.href = `../EditBoth.html?data=${JSON.stringify(item)}`;
            editLink.classList.add("btn", "btn-primary"); // Thêm class của Bootstrap
            editLink.textContent = "Edit";
            editLink.onclick = () => {
                // Xử lý sự kiện chỉnh sửa ở đây
                console.log("Edit button clicked for:", item);
            };
            editTd.appendChild(editLink);
            tr.appendChild(editTd);

            const deleteTd = document.createElement("td");
            const deleteLink = document.createElement("a");
            deleteLink.href = "#"; // Đặt href tùy ý
            deleteLink.classList.add("btn", "btn-danger"); // Thêm class của Bootstrap
            deleteLink.textContent = "Delete";
            deleteLink.onclick = () => {
                // Xử lý sự kiện xóa ở đây
                console.log("Delete button clicked for:", item);
            };
            deleteTd.appendChild(deleteLink);
            tr.appendChild(deleteTd);

            tbody.appendChild(tr);
        });
    } else {
        console.error(`Table body with id ${tableId} not found.`);
    }
};

let pageNumber = 1;
const pageSize = 10;

fetchDataAndAddToTable(pageNumber, pageSize);

document.getElementById("nextPage").addEventListener("click", () => {
    pageNumber++;
    fetchDataAndAddToTable(pageNumber, pageSize);
});

document.getElementById("previousPage").addEventListener("click", () => {
    if (pageNumber > 1) {
        pageNumber--;
        fetchDataAndAddToTable(pageNumber, pageSize);
    }
});

export const addDataToTable = (data, tableId) => {
    const tbody = document.getElementById(tableId);
    if (tbody) {
        const newRow = document.createElement("tr");
        Object.values(data.personal).forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value !== null ? value : "";
            newRow.appendChild(td);
        });

        const headerRow = tbody.querySelector("tr:first-child");
        if (headerRow) {
            tbody.insertBefore(newRow, headerRow.nextSibling);
        } else {
            console.error(`Header row not found in table with id ${tableId}.`);
        }

        $("#realtimeModal").modal("show");

        var firstName = data.personal.First_Name || data.personal.firstName;

        var lastName = data.personal.Last_Name || data.personal.lastName;

        var fullName = firstName + " " + lastName;

        document.getElementById("realtime-fullname").innerText = fullName;

        var totalSizeElement = document.getElementById("total-size");
        if (totalSizeElement) {
            var totalSize = parseInt(totalSizeElement.innerText);
            totalSizeElement.innerText = totalSize + 1;
        } else {
            console.error("Element with id 'total-size' not found.");
        }
    } else {
        console.error(`Table body with id ${tableId} not found.`);
    }
};

Pusher.logToConsole = true;

var pusher = new Pusher("a359a59a30b4ddb07bb5", {
    cluster: "ap1",
});

var channel = pusher.subscribe("GoSIS");
channel.bind("HR-person-created", function (data) {
    console.log(data);
    addDataToTable(data, "data");
});

channel.bind("SIS-employee-created", function (data) {
    console.log(data);
    addDataToTable(data, "data");
});

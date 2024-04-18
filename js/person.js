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
        // Create header row
        const headerRow = document.createElement("tr");
        Object.keys(list[0]).forEach((key) => {
            const th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
        });
        tbody.appendChild(headerRow);

        // Create rows for data
        list.forEach((item) => {
            const tr = document.createElement("tr");
            Object.values(item).forEach((value) => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
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
        // Create row for new data
        const newRow = document.createElement("tr");
        Object.values(data.personal).forEach((value) => {
            const td = document.createElement("td");
            td.textContent = value;
            newRow.appendChild(td);
        });

        // Insert new row below the header row
        const headerRow = tbody.querySelector("tr:first-child");
        if (headerRow) {
            tbody.insertBefore(newRow, headerRow.nextSibling);
        } else {
            console.error(`Header row not found in table with id ${tableId}.`);
        }
    } else {
        console.error(`Table body with id ${tableId} not found.`);
    }
};

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher("a359a59a30b4ddb07bb5", {
    cluster: "ap1",
});

var channel = pusher.subscribe("GoSIS");
channel.bind("personal-created", function (data) {
    console.log(data);
    addDataToTable(data, "data");
});

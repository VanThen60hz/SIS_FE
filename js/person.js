export const findAll = async () => {
    try {
        let response = await axios.get("http://localhost:8080/merge-person");
        return response.data.data; // Access the array in the 'data' property of the 'data' object
    } catch (e) {
        console.log(e);
    }
};

const fetchDataAndAddToTable = async () => {
    const listPerson = await findAll();
    console.log(listPerson);
    addListToTable(listPerson, "data");
};

export const addListToTable = (list, tableId) => {
    const tbody = document.getElementById(tableId);
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

fetchDataAndAddToTable();

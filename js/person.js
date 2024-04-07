// person.js

export const findAll = async () => {
    try {
        let response = await axios.get("http://localhost:4000/api/employee");
        return response.data.data;
    } catch (e) {
        console.log(e);
    }
};

const listPerson = await findAll();
console.log(listPerson);

const fetchDataAndAddToTable = async () => {
    const listPerson = await findAll();
    console.log(listPerson);
    addListToTable(listPerson, "data");
};

export const addListToTable = (list, tableId) => {
    const tbody = document.getElementById(tableId);
    if (tbody) {
        list.forEach((item) => {
            const { _id, ...data } = item;
            const tr = document.createElement("tr");
            Object.values(data).forEach((value) => {
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

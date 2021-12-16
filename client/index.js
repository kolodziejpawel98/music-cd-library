document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
});


document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "btn btn-outline-danger") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "btn btn-outline-secondary") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('.btn-dark');
const updateBtnCancel = document.querySelector('.btn-outline-dark');
const searchBtn = document.querySelector('.btn-secondary');

searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
}

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;
}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');


    console.log(updateNameInput);

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
}

updateBtnCancel.onclick = function() {
    location.reload();
}


const addBtn = document.querySelector('.btn-primary');

addBtn.onclick = function () {
    console.log("wchodzimy do obslugi addBtn")
    const coverInput = document.querySelector('#cover-input');
    const nameInput = document.querySelector('#name-input');
    const authorInput = document.querySelector('#author-input');
    const genreInput = document.querySelector('#genre-input');
    const cover = coverInput.value;
    const name = nameInput.value;
    const author = authorInput.value;
    const genre = genreInput.value;
    coverInput.value = "";
    nameInput.value = "";
    authorInput.value = "";
    genreInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ cover: cover, name: name, author: author, genre: genre})
    })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']));
}

function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    // tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Usuń</td>`;
    tableHtml += `<td><button type="button" class="btn btn-outline-danger" data-id=${data.id}>Usuń</button></td>`;
    // tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edytuj</td>`;
    tableHtml += `<td><button type="button" class="btn btn-outline-secondary" data-id=${data.id}>Edytuj</button></td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
    location.reload();
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='7'>Brak płyt</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id, okladka, nazwa, autor, dataDodania, gatunek}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td><img src=${okladka} width="100" height="100"></td>`;
        // tableHtml += `<td>${okladka}</td>`;
        tableHtml += `<td>${nazwa}</td>`;
        tableHtml += `<td>${autor}</td>`;
        tableHtml += `<td>${new Date(dataDodania).toLocaleString()}</td>`;
        tableHtml += `<td>${gatunek}</td>`;
        // tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Usuń</td>`;
        tableHtml += `<td><button type="button" class="btn btn-outline-danger" data-id=${id}>Usuń</button></td>`;
        // tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edytuj</td>`;
        tableHtml += `<td><button type="button" class="btn btn-outline-secondary" data-id=${id}>Edytuj</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

function passwordCheck() {
    var x = document.getElementById("hidden-content");
    const password = document.querySelector('#password-input').value;
    if(password == "haslo") {
        if (x.hidden = true) {
            console.log("wchodzimy do zawartosci");
            console.log("password: ", password);
            x.hidden = false;
        }
    }
}

function hideShow() {
    var x = document.getElementById("password-input");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
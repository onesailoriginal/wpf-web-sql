document.body.style.backgroundColor = "pink";
loadDatas();

// Adatok betöltése
function loadDatas() {
    const request = new XMLHttpRequest();
    request.open('get', '/datas');
    request.onreadystatechange = () => {
        if (request.readyState == XMLHttpRequest.DONE) {
            if (request.status == 200) {
                const result = JSON.parse(request.response);
                const section = document.getElementById('newDatas');
                section.innerText = ""; // Töröljük a korábbi kártyákat

                // Minden adatot egy új kártya formájában hozzáadunk
                for (let item of result) {
                    addCardToTop(item);
                }
            } else {
                alert("Hiba történt az adatok lekérésekor!");
            }
        }
    };
    request.send();
}

// Kártya hozzáadása
function addCardToTop(data) {
    const section = document.getElementById('newDatas');

    // Kártya div létrehozása
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <button class="editBtn" onclick="editCard(${data.id}, '${data.name}', '${data.number}')">
            <i class="fas fa-edit"></i>
        </button>
        <button class="deleteBtn" onclick="deleteCard(${data.id})">
            <i class="fas fa-trash-alt"></i>
        </button>
        <p>${data.name}</p>
        <p>${data.number}</p>
    `;

    // Kártya hozzáadása az első helyre
    section.prepend(div);
}

// Új adat hozzáadása
function buttonss() {
    const asd = new XMLHttpRequest();
    const Name = document.getElementById('Name');
    const Number = document.getElementById('Number');
    asd.open('post', '/datas');
    asd.setRequestHeader('Content-Type', 'application/json');
    asd.send(
        JSON.stringify({
            name: Name.value,
            number: Number.value,
        })
    );
    asd.onreadystatechange = () => {
        if (asd.readyState == XMLHttpRequest.DONE && asd.status == 200) {
            const newData = JSON.parse(asd.response);
            addCardToTop(newData); // Az új adat hozzáadása
        }
    };
}

// Kártya törlésének kezelése
function deleteCard(id) {
    const request = new XMLHttpRequest();
    request.open('delete', `/datas/${id}`);
    request.onreadystatechange = () => {
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
            loadDatas(); // Adatok újratöltése a törlés után
        }
    };
    request.send();
}

// Kártya szerkesztésének kezelése
function editCard(id, name, number) {
    const newName = prompt("Edit name:", name);
    const newNumber = prompt("Edit number:", number);

    if (newName && newNumber) {
        const request = new XMLHttpRequest();
        request.open('put', `/datas/${id}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(
            JSON.stringify({
                name: newName,
                number: newNumber,
            })
        );
        request.onreadystatechange = () => {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                loadDatas(); // Az adatok újratöltése a módosítás után
            }
        };
    }
}
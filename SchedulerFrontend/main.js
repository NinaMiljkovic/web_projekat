class Workshop {
    constructor(id, name, organizerId, date, noOfSlots, categoryId) {
        this.id = id;
        this.name = name;
        this.organizerId = organizerId;
        this.date = date;
        this.noOfSlots = noOfSlots;
        this.categoryId = categoryId;
    }
}

var logout = document.getElementById('logout');

logout.addEventListener('click', function () {
    document.cookie = "jwt_token=";
    javascript: location.reload(true);
})

var userId = 1002;
var user;

var token;

let name = "jwt_token=";
let decodedCookie = decodeURIComponent(document.cookie);
let ca = decodedCookie.split(';');
for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        token = c.substring(name.length, c.length);
    }
}

fetch('https://localhost:7233/api/Workshop/GetUser', {
    method: 'get',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
}).then(function (response) {
    if (response.status != 200)
        window.location.replace('/SchedulerFrontend/login.html');
    return response.json();
}).then(function (json) {
    user = json;
    userId = json.id;
    console.log(JSON.stringify(user));

    var array = [];

    fetch('https://localhost:7233/api/Workshop/GetWorkshops', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (response) {
        return response.json();
    }).then(function (text) {
        console.log(text);
        array = text;

        for (var i = 0; i < array.length; i++) {
            var newRow = table.insertRow(table.length);
            newRow.id = i;

            var rowId = i;

            var name = newRow.insertCell();
            name.innerHTML = array[i].name.replace(/ /g, '');;
            name.id = 'name';

            var organizer = newRow.insertCell();
            organizer.innerHTML = array[i].organizer.name;
            organizer.id = 'organizer';

            var date = newRow.insertCell();
            date.innerHTML = array[i].date.substring(0, array[i].date.length - 9);;
            date.id = 'date';

            var slots = newRow.insertCell();
            slots.innerHTML = array[i].attendees.length + '/' + array[i].availableSlots;
            slots.id = 'slots';

            var category = newRow.insertCell();
            category.innerHTML = array[i].category.name;
            category.id = 'category';

            var actions = newRow.insertCell();
            actions.id = 'actions';
            if (userId == array[i].organizer.id) {
                var workshopId = array[i].id;

                var btnIzmeni = document.createElement('input');
                btnIzmeni.type = "button";
                btnIzmeni.id = "btnIzmeni-" + i + "-" + workshopId;
                btnIzmeni.value = 'izmeni';

                var btnObrisi = document.createElement('input');
                btnObrisi.type = "button";
                btnObrisi.id = "btnObrisi-" + i + "-" + workshopId;
                btnObrisi.value = 'obrisi';

                actions.appendChild(btnIzmeni);
                actions.appendChild(btnObrisi);

                btnIzmeni.addEventListener('click', function () {

                    var rowId = this.id.split('-')[1];
                    var workshopId = this.id.split('-')[2];

                    console.log(this.id);

                    var row = document.getElementById(rowId);

                    var cells = row.getElementsByTagName('td');

                    var temp;

                    var name = cells[0];

                    temp = name.innerHTML;
                    name.innerHTML = "";
                    var nameInput = document.createElement('input');
                    nameInput.id = "nameInput";
                    nameInput.value = temp;
                    name.appendChild(nameInput);

                    var organizator = cells[1];

                    organizator.innerHTML = "";
                    organizator.innerHTML = user.name;

                    var date = cells[2];

                    temp = date.innerHTML;
                    date.innerHTML = "";
                    var dateInput = document.createElement('input');
                    dateInput.id = "dateInput";
                    dateInput.type = 'date';
                    dateInput.value = temp;
                    date.appendChild(dateInput);

                    var slots = cells[3];

                    temp = slots.innerHTML.split('/')[1];
                    slots.innerHTML = "";
                    var slotsInput = document.createElement('input');
                    slotsInput.id = "slotsInput";
                    slotsInput.value = temp;
                    slotsInput.style.width = "5ch";
                    slots.appendChild(slotsInput);

                    var category = cells[4];

                    temp = category.innerHTML;
                    category.innerHTML = "";
                    var categoryInput = document.createElement('select');
                    categoryInput.id = "categoryInput";

                    var addNewCategoryInput = document.createElement('input');
                    addNewCategoryInput.id = 'newCategoryInput';
                    var addNewCategorySelected = false;

                    fetch('https://localhost:7233/api/Workshop/GetCategories', {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    }).then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        json.forEach(element => {
                            var category = document.createElement('option');
                            category.value = element.id;
                            category.innerHTML = element.name;

                            if (element.name == temp)
                                category.selected = 'selected';

                            categoryInput.appendChild(category);
                        });

                        var addNewCategoryOption = document.createElement('option');
                        addNewCategoryOption.value = -1;
                        addNewCategoryOption.innerHTML = 'Dodaj novu kategoriju';
                        categoryInput.appendChild(addNewCategoryOption);

                    }).catch(function (error) {
                        console.error(error);

                        var addNewCategoryOption = document.createElement('option');
                        addNewCategoryOption.value = -1;
                        addNewCategoryOption.innerHTML = 'Dodaj novu kategoriju';
                        categoryInput.appendChild(addNewCategoryOption);

                        category.appendChild(addNewCategoryInput);
                        addNewCategorySelected = true;
                    });

                    categoryInput.addEventListener('change', function () {
                        if (this.value == -1) {
                            category.appendChild(addNewCategoryInput);
                            addNewCategorySelected = true;
                        } else {
                            category.removeChild(addNewCategoryInput);
                            addNewCategorySelected = false;
                        }
                    });

                    category.appendChild(categoryInput);

                    actions = cells[5];

                    actions.innerHTML = '';
                    var btn = document.createElement('input');
                    btn.type = "button";
                    btn.id = 'izmeni';
                    btn.value = 'izmeni';
                    actions.appendChild(btn);

                    btn.addEventListener('click', function () {
                        var categoryId = categoryInput.value;
                        if (addNewCategorySelected) {
                            fetch('https://localhost:7233/api/Workshop/CreateCategory/', {
                                method: 'post',
                                body: JSON.stringify(JSON.parse('{' +
                                    '"id": 0,' +
                                    '"name": "' + addNewCategoryInput.value + '"' +
                                    '}')),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                }
                            }).then(function (response) {
                                if (response.status == 200)
                                    alert("Uspesno dodata kategorija");
                                else
                                    alert("Uneta kategorija vec postoji!");
                                return response.text();
                            }).then(function (text) {
                                categoryId = text;
                                fetch('https://localhost:7233/api/Workshop/UpdateWorkshop/', {
                                    method: 'put',
                                    body: new Workshop(workshopId, nameInput.value, userId, dateInput.value, slotsInput.value, categoryId),
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + token
                                    }
                                }).then(function (response) {
                                    if (response.status == 200)
                                        alert("Uspesno izmenjena radionica");
                                    else
                                        alert("Greska prilikom menjanja");

                                    javascript: location.reload(true);
                                    return response.text();
                                }).then(function (text) {
                                    categoryId = text;

                                }).catch(function (error) {
                                    console.error(error);
                                });
                            }).catch(function (error) {
                                console.error(error);
                            });
                        } else {
                            console.log('{' +
                                '"id": ' + workshopId + ',' +
                                '"name": "' + nameInput.value + '",' +
                                '"organizerId": ' + userId + ',' +
                                '"date": "' + dateInput.value + '",' +
                                '"noOfSlots": ' + slotsInput.value + ',' +
                                '"categoryId": ' + categoryId +
                                '}');

                            fetch('https://localhost:7233/api/Workshop/UpdateWorkshop/', {
                                method: 'put',
                                body: JSON.stringify(JSON.parse('{' +
                                    '"id": ' + workshopId + ',' +
                                    '"name": "' + nameInput.value + '",' +
                                    '"organizerId": ' + userId + ',' +
                                    '"date": "' + dateInput.value + '",' +
                                    '"noOfSlots": ' + slotsInput.value + ',' +
                                    '"categoryId": ' + categoryId +
                                    '}')),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                }
                            }).then(function (response) {
                                if (response.status == 200)
                                    alert("Uspesno izmenjena radionica");
                                else
                                    alert("Greska prilikom menjanja");

                                javascript: location.reload(true);
                                return response.text();
                            }).then(function (text) {
                                categoryId = text;

                            }).catch(function (error) {
                                console.error(error);
                            });

                        }
                    });
                });

                btnObrisi.addEventListener('click', function () {

                    var rowId = this.id.split('-')[1];
                    var workshopId = this.id.split('-')[2];

                    fetch('https://localhost:7233/api/Workshop/DeleteWorkshop/' + workshopId, {
                        method: 'delete',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    }).then(function (response) {
                        if (response.status == 200)
                            alert("Uspesno obrisana radionica " + workshopId);
                        alert("Greska prilikom brisanja");

                        javascript: location.reload(true);
                    }).catch(function (error) {
                        console.error(error);
                    });
                });

            }
            else {
                var btnPrijava = document.createElement('input');
                btnPrijava.type = "button";
                btnPrijava.id = "prijava-" + i + "-" + array[i].id;
                btnPrijava.value = 'prijavi se';
                actions.appendChild(btnPrijava);

                var btnOdjava = document.createElement('input');
                btnOdjava.type = "button";
                btnOdjava.id = "odjava-" + i + "-" + array[i].id;
                btnOdjava.value = 'odjavi se';
                btnOdjava.style.visibility = "hidden";
                actions.appendChild(btnOdjava);

                btnPrijava.addEventListener('click', function () {
                    var rowId = this.id.split('-')[1];
                    var workshopId = this.id.split('-')[2];

                    fetch('https://localhost:7233/api/Workshop/CreateAttendee/' + workshopId, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    }).then(function (response) {
                        if (response.status == 200)
                            alert('Dodata prijava ' + workshopId);
                        else
                            alert("Greska prilikom prijave");

                        javascript: location.reload(true);
                    }).catch(function (error) {
                        console.error(error);
                    });

                });

                btnOdjava.addEventListener('click', function () {
                    var rowId = this.id.split('-')[1];
                    var workshopId = this.id.split('-')[2];

                    fetch('https://localhost:7233/api/Workshop/DeleteAttendee/' + workshopId, {
                        method: 'delete',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    }).then(function (response) {
                        if (response.status == 200)
                            alert("Uspesno obrisana prijava " + workshopId);
                        else
                            alert("Greska prilikom brisanja");

                        javascript: location.reload(true);
                    }).catch(function (error) {
                        console.error(error);
                    });

                });

                array[i].attendees.forEach(element => {
                    if (userId == element.id) {
                        btnOdjava.style.visibility = "visible";
                        btnPrijava.style.visibility = "hidden";
                    }

                });
            }
        }

        var newRow = table.insertRow(table.length);

        var name = newRow.insertCell();
        var nameInput = document.createElement('input');
        nameInput.id = "nameInput";
        name.appendChild(nameInput);

        var organizator = newRow.insertCell();
        organizator.innerHTML = user.name;

        var date = newRow.insertCell();
        var dateInput = document.createElement('input');
        dateInput.id = "dateInput";
        dateInput.type = 'date';
        date.appendChild(dateInput);

        var slots = newRow.insertCell();
        var slotsInput = document.createElement('input');
        slotsInput.id = "slotsInput";
        slotsInput.style.width = "5ch";
        slots.appendChild(slotsInput);

        var category = newRow.insertCell();
        var categoryInput = document.createElement('select');
        categoryInput.id = "categoryInput";

        var addNewCategoryInput = document.createElement('input');
        addNewCategoryInput.id = 'newCategoryInput';
        var addNewCategorySelected = false;

        fetch('https://localhost:7233/api/Workshop/GetCategories', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.forEach(element => {
                var category = document.createElement('option');
                category.value = element.id;
                category.innerHTML = element.name;

                categoryInput.appendChild(category);
            });

            var addNewCategoryOption = document.createElement('option');
            addNewCategoryOption.value = -1;
            addNewCategoryOption.innerHTML = 'Dodaj novu kategoriju';
            categoryInput.appendChild(addNewCategoryOption);

        }).catch(function (error) {
            console.error(error);
            var addNewCategoryOption = document.createElement('option');
            addNewCategoryOption.value = -1;
            addNewCategoryOption.innerHTML = 'Dodaj novu kategoriju';
            categoryInput.appendChild(addNewCategoryOption);

            category.appendChild(addNewCategoryInput);
            addNewCategorySelected = true;
        });

        categoryInput.addEventListener('change', function () {
            if (this.value == -1) {
                category.appendChild(addNewCategoryInput);
                addNewCategorySelected = true;
            } else {
                if (addNewCategorySelected)
                    category.removeChild(addNewCategoryInput);
                addNewCategorySelected = false;
            }
        });

        category.appendChild(categoryInput);

        var actions = newRow.insertCell();

        var btn = document.createElement('input');
        btn.type = "button";
        btn.id = 'dodaj';
        btn.value = 'dodaj';
        actions.appendChild(btn);

        btn.addEventListener('click', function () {
            var categoryId = categoryInput.value;
            if (addNewCategorySelected) {
                fetch('https://localhost:7233/api/Workshop/CreateCategory/', {
                    method: 'post',
                    body: JSON.stringify(JSON.parse('{' +
                        '"id": 0,' +
                        '"name": "' + addNewCategoryInput.value + '"' +
                        '}')),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).then(function (response) {
                    if (response.status == 200)
                        alert("Uspensno dodata kategorija");
                    else
                        alert("Greska prilikom dodavanja");
                    return response.text();
                }).then(function (text) {
                    categoryId = text;
                    fetch('https://localhost:7233/api/Workshop/CreateWorkshop/', {
                        method: 'post',
                        body: JSON.stringify(JSON.parse('{' +
                            '"id": 0,' +
                            '"name": "' + nameInput.value + '",' +
                            '"organizerId": ' + userId + ',' +
                            '"date": "' + dateInput.value + '",' +
                            '"noOfSlots": ' + slotsInput.value + ',' +
                            '"categoryId": ' + categoryId +
                            '}')),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    }).then(function (response) {
                        if (response.status == 200)
                            alert('Uspesno dodata radionica');
                        else
                            alert("Greska prilikom dodavanja");

                        javascript: location.reload(true);
                        return response.text();
                    }).then(function (text) {
                        categoryId = text;

                    }).catch(function (error) {
                        console.error(error);
                    });
                }).catch(function (error) {
                    console.error(error);
                });
            } else {
                fetch('https://localhost:7233/api/Workshop/CreateWorkshop/', {
                    method: 'post',
                    body: JSON.stringify(JSON.parse('{' +
                        '"id": 0,' +
                        '"name": "' + nameInput.value + '",' +
                        '"organizerId": ' + userId + ',' +
                        '"date": "' + dateInput.value + '",' +
                        '"noOfSlots": ' + slotsInput.value + ',' +
                        '"categoryId": ' + categoryId +
                        '}')),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).then(function (response) {
                    if (response.status == 200)
                        alert('Uspesno dodata radionica');
                    else
                        alert("Greska prilikom dodavanja");

                    javascript: location.reload(true);
                    return response.text();
                }).then(function (text) {
                    categoryId = text;

                }).catch(function (error) {
                    console.error(error);
                });
            }
        });


    }).catch(function (error) {
        console.error(error);
    });
}).catch(function (error) {
    console.error(error);
});

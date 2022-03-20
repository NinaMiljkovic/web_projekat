var token;
let failed=false;

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
    if (response.status == 200)
        window.location.replace('/SchedulerFrontend/index.html');
    return response.json();
}).then(function (json) {
    user = json;
    userId = json.id;
    console.log(JSON.stringify(user));
}).catch(function (error) {
    console.log(error);
});

function loginInit() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const userCred = JSON.stringify(Object.fromEntries(new FormData(this).entries()));

        fetch('https://localhost:7233/api/Authentication/Login', {
            method: 'post',
            body: userCred,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            if (response.status != 200)
             failed=true;
            return response.text();
        }).then(function (text) {
            if(failed)
            alert(text);
            else{
            document.cookie = "jwt_token=" + text;
            window.location.replace('/SchedulerFrontend/index.html');
            }
        }).catch(function (error) {
            console.error(error);
        });
    });
}

function registerInit() {
    failed=false;
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const tblUsers = JSON.stringify(Object.fromEntries(new FormData(this).entries()));

        fetch('https://localhost:7233/api/Authentication/Register', {
            method: 'post',
            body: tblUsers,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            if (response.status != 200)
                failed=true;
            return response.text();
        }).then(function (text) {
            if(failed)
            alert(text);
            else{
            document.cookie = "jwt_token=" + text;
            window.location.replace('/SchedulerFrontend/index.html');
            }
        }).catch(function (error) {
            console.error(error);
        });
    });
}
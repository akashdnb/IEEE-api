const loader = document.getElementById('loader');
const loginBtn = document.getElementById('loginBtn');

if(getCookie("token")) {
    window.location.href = 'dashboard'
}

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    loader.style.display = 'block';
    loginBtn.setAttribute('disabled', 'disabled');
    const formData = new URLSearchParams(new FormData(this));

    fetch('/admin/login', {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then(response => response.json())
        .then(data => {
            loader.style.display = 'none';
            loginBtn.removeAttribute('disabled');
            // const token = `Bearer ${data.token}`;
            // setCookie("token", token, 1);
            window.location.href = 'dashboard'
            
        })
        .catch(error => {
            loader.style.display = 'none';
            loginBtn.removeAttribute('disabled');
            console.error('Login failed:', error);
            // Handle error, e.g., show an error message to the user
        });
});

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}
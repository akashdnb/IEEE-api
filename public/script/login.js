document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
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
            const token = `Bearer ${data.token}`;
            setCookie("token", token, 1);
            window.location.href = 'dashboard'
            
        })
        .catch(error => {
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
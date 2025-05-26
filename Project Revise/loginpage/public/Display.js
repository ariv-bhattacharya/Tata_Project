
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const textResponse = await response.text();

        if (response.ok) {
            loginMessage.textContent = textResponse;
            loginMessage.style.color = 'green';
        
        } else {
            loginMessage.textContent = textResponse;
            loginMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during login:', error);
        loginMessage.textContent = 'An unexpected error occurred during login.';
        loginMessage.style.color = 'red';
    }
    passwordInput.value = '';
});
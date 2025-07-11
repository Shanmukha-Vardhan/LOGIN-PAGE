document.addEventListener('DOMContentLoaded', () => {
    const signInContainer = document.getElementById('signInContainer');
    const signUpContainer = document.getElementById('signUpContainer');
    const showSignUp = document.getElementById('showSignUp');
    const showSignIn = document.getElementById('showSignIn');
    
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    
    const signInMessage = document.getElementById('signInMessage');
    const signUpMessage = document.getElementById('signUpMessage');

    if (showSignUp) {
        showSignUp.addEventListener('click', (e) => {
            e.preventDefault();
            signInContainer.classList.add('hidden');
            signUpContainer.classList.remove('hidden');
        });
    }

    if (showSignIn) {
        showSignIn.addEventListener('click', (e) => {
            e.preventDefault();
            signUpContainer.classList.add('hidden');
            signInContainer.classList.remove('hidden');
        });
    }

    if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signUpUsername').value;
            const password = document.getElementById('signUpPassword').value;
            const response = await fetch('/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), });
            const result = await response.json();
            signUpMessage.textContent = result.message;
            signUpMessage.className = response.ok ? 'form-message success' : 'form-message error';
        });
    }

    if (signInForm) {
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signInUsername').value;
            const password = document.getElementById('signInPassword').value;
            const response = await fetch('/signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }), });
            const result = await response.json();
            
            if (response.ok) {
                window.location.href = '/dashboard.html';
            } else {
                const signInMessage = document.getElementById('signInMessage');
                signInMessage.textContent = result.message;
                signInMessage.className = 'form-message error';
            }
        });
    }
});

function handleCredentialResponse(response) {
    const tokenPayload = JSON.parse(atob(response.credential.split('.')[1]));
    const user = {
        googleId: tokenPayload.sub,
        name: tokenPayload.name,
        email: tokenPayload.email,
    };

    localStorage.setItem('user', JSON.stringify(user));

    fetch('https://immigrate-forward-dev.onrender.com/auth/google', {
    // fetch('/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
}

function signOut() {
    localStorage.removeItem('user');
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke('', (response) => alert('You have been signed out.'));
}

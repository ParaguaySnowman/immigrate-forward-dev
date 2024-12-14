function handleCredentialResponse(response) {
    const token = response.credential; // This is the ID token from Google

    if (!token) {
        console.error("Google Sign-In returned no token");
        return;
    }

    // Send the token to the backend
    fetch('https://immigrate-forward-dev.onrender.com/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }), // Sending token to backend
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.message === 'User authenticated') {
                alert(`Welcome, ${data.user.name}!`);
            } else {
                console.error('Authentication failed:', data);
            }
        })
        .catch((err) => console.error('Error:', err));
}


function signOut() {
    localStorage.removeItem('user');
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke('', (response) => alert('You have been signed out.'));
}

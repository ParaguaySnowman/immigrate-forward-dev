function handleCredentialResponse(response) {
    const token = response.credential; // Extract token from Google response

    if (!token) {
        console.error("No token received from Google Sign-In");
        return;
    }

    console.log("Sending token to backend:", token); // Log the token for debugging

    fetch('https://immigrate-forward-dev.onrender.com/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }), // Send token to backend
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

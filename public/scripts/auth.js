function handleCredentialResponse(response) {
    const token = response.credential; // Extract token from response

    if (!token) {
        console.error("No token received from Google Sign-In");
        return;
    }

    console.log("Token received from Google Sign-In:", token); // Debugging

    fetch('https://immigrate-forward-dev.onrender.com/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }), // Send token under `token` key
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Response from backend:", data);
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

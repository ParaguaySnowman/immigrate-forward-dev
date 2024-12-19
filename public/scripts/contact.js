//public/scripts/contact.js
//(immigrate-forward-dev)

const form = document.getElementById('contactForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    try {
        fetch('https://immigrate-forward-dev.onrender.com/contact', {
        // const response = await fetch('/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });
        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error('Error:', error);
    }
});

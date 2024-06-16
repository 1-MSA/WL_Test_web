document.querySelector('.admin-button').addEventListener('click', function() {
    const adminList = document.getElementById('admins');
    adminList.classList.toggle('hidden');
});

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function showSignInNotification() {
    const signInNotification = document.getElementById('signInNotification');
    signInNotification.classList.remove('hidden');
    setTimeout(() => {
        signInNotification.classList.add('hidden');
    }, 3000);
}

document.getElementById('supportForm').addEventListener('submit', function(event) {
    event.preventDefault();

    if (!isUserLoggedIn()) {
        showSignInNotification();
        return;
    }

    const username = document.getElementById('username').value;
    const contact = document.getElementById('contact').value;
    const problem = document.getElementById('problem').value;

    const webhookURL = 'https://discord.com/api/webhooks/1251568248047276053/YNeZYLCvrvRwFLrFVDNHqDQ0uMr5ECkynuhRoxdt0_RTygqvoTubWgdqcGH2vcM7pgTR';

    const payload = {
        content: `New support request received:\n\n**User Name:** ${username}\n**Contact Info:** ${contact}\n**Problem Details:**\n${problem}`
    };

    fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                showNotification('Sent Successfully');
                document.getElementById('supportForm').reset();

                const submitButton = document.querySelector('#supportForm button');
                submitButton.disabled = true;
                setTimeout(() => {
                    submitButton.disabled = false;
                }, 15 * 60 * 1000);
            } else {
                showNotification('Failed to send');
            }
        })
        .catch(error => {
            showNotification('Error: ' + error.message);
        });
});

function isUserLoggedIn() {
    return !document.getElementById('signInButton').classList.contains('hidden');
}

document.getElementById('signInButton').addEventListener('click', function() {
    const clientId = '1251775558128504893';
    const redirectUri = encodeURIComponent('https://1-msa.github.io/WL_Test_web/');
    const scope = encodeURIComponent('identify');
    const responseType = 'token';
    const discordOauth2Url = `https://discord.com/oauth2/authorize?client_id=1251775558128504893&response_type=code&redirect_uri=https%3A%2F%2F1-msa.github.io%2FWL_Test_web%2F&scope=identify`;
    window.location.href = discordOauth2Url;
});

window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
        fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('signInButton').classList.add('hidden');
                const userAvatar = document.getElementById('userAvatar');
                userAvatar.src = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`;
                userAvatar.classList.remove('hidden');
                document.getElementById('support-form').classList.remove('hidden');
            })
            .catch(error => console.error('Error:', error));
    }
});
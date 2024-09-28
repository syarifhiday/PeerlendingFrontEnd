function getBalance() {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const id = decodedToken.Id

    fetch('/ApiMstUser/GetUserById?id=' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');

            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const user = data.data;
                document.getElementById('balance').textContent = `Rp ${user.balance}`;


            } else {
                alert('User not found');
            }
        })
        .catch(Error => {
            alert('Error fetching user data: ' + Error.message);
        });
}

window.onload = getBalance;
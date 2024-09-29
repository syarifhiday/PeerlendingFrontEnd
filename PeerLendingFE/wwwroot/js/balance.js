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

async function updateBalance() {
    const balance = document.getElementById('userBalance').value;
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const id = decodedToken.Id;

    const reqUpdateBalanceDto = {
        "balance": parseFloat(balance)
    };

    const response = await fetch(`/ApiMstUser/UpdateBalanceUser/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqUpdateBalanceDto)
    });

    if (!response.ok) {
        alert('Failed to update balance');
        return;
    }

    alert('Balance added successfully');

    // Tutup modal secara manual dengan menghapus class "show" dan menambahkan "d-none"
    const modalElement = document.getElementById('editBalanceModal');
    modalElement.classList.remove('show');
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.style.display = 'none';

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove(); 
    }

    getBalance(); 
}

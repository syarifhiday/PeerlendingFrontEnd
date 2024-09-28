async function fetchUsers() {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('ApiMstUser/GetAllUsers', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch users');
        return;
    }

    const jsonData = await response.json();
    if (jsonData.success) {
        populateUserTable(jsonData.data);
    } else {
        alert('No users found')
    }
}

function populateUserTable(users) {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = ''

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.balance}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editUser('${user.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    })
}

window.onload = fetchUsers();

function addUser() {
    // Clear the form fields
    document.getElementById('userName').value = '';
    document.getElementById('userRole').value = '';
    document.getElementById('userBalance').value = '';
    document.getElementById('userId').value = ''; 

    // Show the modal
    $('#addUserModal').modal('show');
}

function saveNewUser() {
    const name = document.getElementById('addUserName').value;
    const email = document.getElementById('addUserEmail').value; 
    const role = document.getElementById('addUserRole').value;
    const balance = 0; 

    const token = localStorage.getItem('jwtToken');
    const newUser = {
        name: name,
        email: email,
        role: role,
        balance: balance,
        password: 'Password1' 
    };

    fetch('/ApiMstUser/AddUser', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add user');
            }
            return response.json();
        })
        .then(data => {
            alert('User added successfully');
            $('#addUserModal').modal('hide');
            fetchUsers();
        })
        .catch(error => {
            alert('Error adding user: ' + error.message);
        });
}


function editUser(id) {
    const token = localStorage.getItem('jwtToken');
    fetch('/ApiMstUser/GetUserById?id='+id, {
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
            console.log(user);
            document.getElementById('userName').value = user.name;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userBalance').value = user.balance;

            document.getElementById('userId').value = user.id;

            $('#editUserModal').modal('show');

        } else {
            alert('User not found');
        }
    })
    .catch(Error => {
        alert('Error fetching user data: ' + Error.message);
    });
}

async function updateUser() {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const balance = document.getElementById('userBalance').value;

    const reqMstUserDto = {
        name: name,
        role: role,
        balance: parseFloat(balance)
    }
    console.log(reqMstUserDto);

    const token = localStorage.getItem('jwtToken');

    try {
        const response = await fetch('ApiMstUser/UpdateUser/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqMstUserDto),
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        const data = await response.json();

        alert('User updated successfully');
        $('#editUserModal').modal('hide');
        fetchUsers();
    } catch (error) {
        alert('Error updating user: ' + error.message);
    }

}

async function deleteUser(id) {
    const token = localStorage.getItem('jwtToken');

    try {
        const response = await fetch('ApiMstUser/DeleteUser/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        const data = await response.json();
        alert('User deleted successfully');

        fetchUsers();
    } catch (error) {
        alert('Error deleting user: ' + error.message);
    }
}

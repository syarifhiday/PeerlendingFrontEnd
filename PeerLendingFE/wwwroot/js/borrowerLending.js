async function fetchLoan() {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const id = decodedToken.Id;
    const response = await fetch('/ApiMstLoan/GetLoansByBorrowerId/' + id, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch loans');
        return;
    }

    const jsonData = await response.json();
    populateLoanTable(jsonData.data);
}
window.onload = fetchLoan();

function populateLoanTable(loans) {
    const loanTableBody = document.querySelector('#loanTable tbody');
    loanTableBody.innerHTML = '';

    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.setAttribute('data-loan-id', loan.id);

        row.innerHTML = `
            <td class="loan-amount">${loan.amount}</td>
            <td class="interest-rate">${loan.interestRate}</td>
            <td>12 months</td>
            <td>${loan.status}</td>
            <td>${loan.createdAt}</td>
        `;
        loanTableBody.appendChild(row);
    });
}

function reqNewLoan() {
    $('#addLoanModal').modal('show');
}

function createNewLoan() {
    const amount = document.getElementById('addLoanAmount').value;
    const interestRate = document.getElementById('addLoanInterestRate').value;
    const duration = document.getElementById('addLoanDuration').value;

    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const id = decodedToken.Id;

    const newLoan = {
        borrowerId: id,
        amount: amount,
        interestRate: interestRate,
        duration: duration
    };

    fetch('/ApiMstLoan/AddLoan', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLoan)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add loan');
            }
            return response.json();
        })
        .then(data => {
            alert('Loan added successfully');
            $('#addLoanModal').modal('hide');
            fetchLoan();
        })
        .catch(error => {
            alert('Error adding loan: ' + error.message);
        });
}


async function fetchLoans() {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/ApiMstLoan/GetLoans', {
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

function populateLoanTable(loans) {
    const loanTableBody = document.querySelector('#loanTable tbody');
    loanTableBody.innerHTML = '';

    loans.forEach(loan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${loan.borrowerName}</td>
            <td>${loan.amount}</td>
            <td>${loan.interestRate}</td>
            <td>12 months</td>
            <td>${loan.status}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="showChangeStatusModal('${loan.loanId}')">Change Status</button>
            </td>
        `;
        loanTableBody.appendChild(row);
    });
}

function showChangeStatusModal(loanId) {
    document.getElementById('loanId').value = loanId;
    $('#changeLoanStatusModal').modal('show');
}

function hideChangeStatusModal() {
    $('#changeLoanStatusModal').modal('hide');
}

async function changeLoanStatus() {
    const loanId = document.getElementById('loanId').value;
    const token = localStorage.getItem('jwtToken');

    const reqMstLoanStatusDto = {
        "status": "accepted"
    }

    const response = await fetch(`/ApiMstLoan/ChangeLoanStatus/${loanId}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqMstLoanStatusDto)
    });

    if (!response.ok) {
        alert('Failed to change loan status');
        return;
    }

    alert('Loan status changed to funded successfully');
    $('#changeLoanStatusModal').modal('hide');
    fetchLoans();
}

window.onload = fetchLoans;

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
        row.setAttribute('data-loan-id', loan.loanId); // Assign loanId to row

        row.innerHTML = `
            <td class="borrower-name">${loan.borrowerName}</td>
            <td class="loan-amount">${loan.amount}</td>
            <td class="interest-rate">${loan.interestRate}</td>
            <td>12 months</td>
            <td>${loan.status}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="showChangeStatusModal('${loan.loanId}')">Fund</button>
            </td>
        `;
        loanTableBody.appendChild(row);
    });
}


function showChangeStatusModal(loanId) {
    const loanRow = document.querySelector(`tr[data-loan-id="${loanId}"]`);
    const borrowerName = loanRow.querySelector('.borrower-name').textContent;
    const loanAmount = loanRow.querySelector('.loan-amount').textContent;
    const interestRate = loanRow.querySelector('.interest-rate').textContent;
    console.log('Nama borrowe: ' + borrowerName);

    document.getElementById('modalBorrowerName').textContent = borrowerName;
    document.getElementById('modalLoanAmount').textContent = loanAmount;
    document.getElementById('modalInterestRate').textContent = interestRate;

    document.getElementById('loanId').value = loanId;

    $('#changeLoanStatusModal').modal('show');
}


function hideChangeStatusModal() {
    $('#changeLoanStatusModal').modal('hide');
}

async function changeLoanStatus() {
    const loanId = document.getElementById('loanId').value;
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwt_decode(token);
    const lender_id = decodedToken.Id;
    const amount = parseFloat(document.getElementById('modalLoanAmount').textContent);
    console.log("user id : " + lender_id);


    const reqMstLoanStatusDto = {
        "status": "funded"
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
        alert('Failed to update status loan');
        return;
    }

    const reqUpdateBalanceDto = {
        "balance": amount
    }

    const response2 = await fetch(`/ApiMstUser/DecreaseBalanceUser/${lender_id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqUpdateBalanceDto)
    });

    if (!response2.ok) {
        alert('Failed to update balance');
        return;
    }

    const reqCreateFundingDto = {
        "loan_id": loanId,
        "lender_id": lender_id,
        "amount": amount
    }

    const response3 = await fetch('/ApiTrnFunding/CreateFunding/', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqCreateFundingDto)
    });

    if (!response3.ok) {
        alert('Failed to create funding');
        return;
    }

    alert('Loan status changed to funded successfully');
    $('#changeLoanStatusModal').modal('hide');
    fetchLoans();
}

window.onload = fetchLoans;

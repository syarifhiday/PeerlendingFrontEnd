let lendings = []; // Definisikan di luar fungsi untuk akses global
let selectedLending = null; // to keep track of the current lending

async function fetchLendings() {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/ApiTrnLending/GetLendings/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch lendings');
        return;
    }

    const jsonData = await response.json();
    lendings = jsonData.data; // Simpan data lendings di variabel global
    populateLendingTable(lendings); // Panggil fungsi untuk menampilkan data di tabel
}

function populateLendingTable(lendings) {
    const lendingTableBody = document.querySelector('#lendingTable tbody');
    lendingTableBody.innerHTML = '';

    lendings.forEach(lending => {
        const row = document.createElement('tr');
        row.setAttribute('data-lending-id', lending.loanId);

        let actionButton = '';
        if (lending.repaidStatus === 'on_repay') {
            actionButton = `<button class="btn btn-primary btn-sm" onclick="showChangeStatusModal('${lending.loanId}')">Pay</button>`;
        } else {
            actionButton = `<span>${lending.repaidStatus}</span>`;
        }

        row.innerHTML = `
            <td>Rp. ${lending.amount}</td>
            <td>${lending.interestRate}%</td>
            <td>${lending.duration} Months</td>
            <td>${lending.repaidStatus}</td>
            <td>${actionButton}</td>
        `;
        lendingTableBody.appendChild(row);
    });
}

function showChangeStatusModal(loanId) {
    const lending = lendings.find(l => l.loanId === loanId); // Find lending by loanId
    selectedLending = lending;

    const totalAmount = lending.amount;
    const repaidAmount = lending.repaidAmount;
    const balanceAmount = lending.balanceAmount;
    const monthlyPayment = totalAmount / 12;

    // Set modal values
    document.getElementById('modalTotalAmount').innerText = totalAmount;
    document.getElementById('modalRepaidAmount').innerText = repaidAmount;
    document.getElementById('modalBalanceAmount').innerText = balanceAmount;

    // Create 12 checklist items representing each month
    const monthlyPaymentsDiv = document.getElementById('monthlyPayments');
    monthlyPaymentsDiv.innerHTML = ''; // Clear existing checkboxes
    for (let i = 1; i <= 12; i++) {
        const checked = i <= (repaidAmount / monthlyPayment) ? 'checked disabled' : '';
        monthlyPaymentsDiv.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="month${i}" value="${monthlyPayment}" ${checked}>
                <label class="form-check-label" for="month${i}">
                    Month ${i} - ${monthlyPayment.toFixed(2)}
                </label>
            </div>
        `;
    }

    // Set total selected payment to 0 at start
    document.getElementById('totalPayment').innerText = '0';

    // Event listener to calculate total selected payment
    document.querySelectorAll('.form-check-input').forEach(input => {
        input.addEventListener('change', updateTotalPayment);
    });

    // Show the modal
    $('#payLoanModal').modal('show');
}

function updateTotalPayment() {
    let totalPayment = 0;
    document.querySelectorAll('.form-check-input:checked').forEach(input => {
        totalPayment += parseFloat(input.value);
    });
    document.getElementById('totalPayment').innerText = totalPayment.toFixed(2);
}

async function payLoan() {
    const selectedPayments = [];
    document.querySelectorAll('.form-check-input:checked').forEach(input => {
        selectedPayments.push(parseFloat(input.value));
    });

    if (selectedPayments.length === 0) {
        alert('Please select at least one month to pay.');
        return;
    }

    const totalPayment = selectedPayments.reduce((a, b) => a + b, 0);

    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/ApiTrnLending/PayLoan/' + selectedLending.id, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pay: totalPayment
        })
    });

    if (response.ok) {
        alert('Payment successful!');
        $('#payLoanModal').modal('hide');
        fetchLendings(); // Refresh the table after payment
    } else {
        alert('Payment failed!');
    }
}

window.onload = fetchLendings;

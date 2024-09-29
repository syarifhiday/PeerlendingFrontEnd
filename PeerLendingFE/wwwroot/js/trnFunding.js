async function fetchFundings() {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch('/ApiTrnFunding/GetFundings', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        alert('Failed to fetch fundings');
        return;
    }

    const jsonData = await response.json();
    populateFundingTable(jsonData.data);
}

function populateFundingTable(fundings) {
    const fundingTableBody = document.querySelector('#fundingTable tbody');
    fundingTableBody.innerHTML = '';

    fundings.forEach(funding => {
        const row = document.createElement('tr');
        row.setAttribute('data-funding-id', funding.id); 

        row.innerHTML = `
            <td class="borrower-name">${funding.borrowerName}</td>
            <td class="funding-amount">${funding.loanAmount}</td>
            <td class="interest-rate">${funding.interestRate}</td>
            <td>12 months</td>
            <td>${funding.status}</td>
            <td>${funding.fundedAt}</td>
        `;
        fundingTableBody.appendChild(row);
    });
}

window.onload = fetchFundings;
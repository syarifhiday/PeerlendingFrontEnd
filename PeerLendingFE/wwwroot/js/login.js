async function submitLogin() {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/ApiLogin/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            const token = result.data.token;
            localStorage.setItem('jwtToken', token);

            // Decode token to get role
            const decodedToken = jwt_decode(token);
            const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            // Redirect berdasarkan role
            if (userRole === 'admin') {
                window.location.href = '/MstUser';
            } else if (userRole === 'lender') {
                window.location.href = '/LenderBalance';
            } else if (userRole === 'borrower') {
                window.location.href = '/BorrowerDashboard';
            }
        } else {
            alert(result.message || 'Login failed. Please try again!');
        }
    } catch (error) {
        alert('An error occurred while logging in: ' + error.message);
    }
}

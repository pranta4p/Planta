document.getElementById('submitBtn').addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing
    const fullName = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // submitBtn.textContent = 'Logging in...';
    alert("value has been taken");
    // submitBtn.textContent = 'Login';
    console.log(fullName);
    console.log(email);
    console.log(password);

});
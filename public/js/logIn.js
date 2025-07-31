document.getElementById('submitBtn').addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the form from submitting and refreshing
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    submitBtn.textContent = 'Logging in...';
    alert("value has been taken");
    submitBtn.textContent = 'Login';
    console.log(email);
    console.log(password);

});
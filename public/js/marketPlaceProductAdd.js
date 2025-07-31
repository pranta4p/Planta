document.getElementById('submitBtn').addEventListener("click", (event) => {
    event.preventDefault(); // Stops the form from submitting

    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const location = document.getElementById('location').value;
    const price = document.getElementById('price').value;
    const unit = document.getElementById('unit').value;
    const sellerName = document.getElementById('sellerName').value;
    const phone = document.getElementById('phone').value;
    const description = document.getElementById('description').value;

    alert("value has been taken");
    console.log(name, type, location, price, unit, sellerName, phone, description);
});
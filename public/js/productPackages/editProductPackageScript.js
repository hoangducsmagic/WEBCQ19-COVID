const productPackageId = document.getElementById('productPackageId').innerText;
document.getElementById("submitBtn").onclick = function (e) {
    e.preventDefault();
    fetch("/products/edit", {
        headers: {
            "Content-Type": "application/json",
        },

        method: "put",
        body: JSON.stringify({
            productId,
            newName: document.getElementById("name").value,
            newQuantity: document.getElementById("quantity").value,            
            newTimeLimit: document.getElementById("time_limit").value,
            newLimitPerPerson: document.getElementById("limit_per_person").value
        }),
    }).then(() => { window.location.href = `/productsPackages/${productPackageId}` })
};

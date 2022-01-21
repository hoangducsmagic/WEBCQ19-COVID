const productPackageId = document.getElementById('productPackageId').innerText;
document.getElementById("submitBtn").onclick = function (e) {
    e.preventDefault();
    fetch("/productPackages/edit", {
        headers: {
            "Content-Type": "application/json",
        },

        method: "put",
        body: JSON.stringify({
            productPackageId,
            productId: document.getElementById("productId").value,
            name: document.getElementById("name").value,
            quantity: document.getElementById("quantity").value,            
            time_limit: document.getElementById("time_limit").value,
            limit_per_person: document.getElementById("limit_per_person").value
        }),
    }).then(() => { window.location.href = `/productsPackages/detail/${productPackageId}` })
};

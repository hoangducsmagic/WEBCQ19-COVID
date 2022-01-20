const productId = document.getElementById('productId').innerText;
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
            newPrice: document.getElementById("price").value,
            newUnit: document.getElementById("unit").value,
        }),
    }).then(() => { window.location.href = `/products/${productId}` })
};

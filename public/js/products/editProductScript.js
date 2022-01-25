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
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            unit: document.getElementById("unit").value,
        }),
    }).then(() => { window.location.href = `/products/${productId}` })
};

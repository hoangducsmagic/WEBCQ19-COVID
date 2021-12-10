const patientId = document.getElementById('patientId').innerText;
document.getElementById("submitBtn").onclick = function (e) {
    e.preventDefault();
    fetch("/patients/edit", {
        headers: {
            "Content-Type": "application/json",
        },

        method: "put",
        body: JSON.stringify({
            patientId,
            newStatus: document.getElementById("status").value,
            newFacility: document.getElementById("facility").value,
        }),
    }).then(() => { window.location.href = `/patients/detail/${patientId}` })
};

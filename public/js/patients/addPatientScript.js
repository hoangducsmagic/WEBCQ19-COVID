document.getElementById('province').onchange = async function () {
    var selectedProvince = this.value;
    $('#district').empty();
    $('#ward').empty();
    $('#ward').append('<option value="" disabled selected>Phường/xã</option>');
    var raw = await fetch(`/patients/location?province=${selectedProvince}`,
    {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
        }
    })
    var data = await raw.json();    
    $('#district').append('<option value="" disabled selected>Quận/huyện</option>');
    
    for (let district of data) {
        $('#district').append(
            `
                <option value="${district.districtId}">${district.districtName}</option>
            `
        )
    }
}

document.getElementById('district').onchange = async function () {
    var selectedDistrict = this.value;
    $('#ward').empty();
    var raw = await fetch(`/patients/location?district=${selectedDistrict}`,
    {
        method: 'get',
        headers: {
            "Content-Type": "application/json",
        }
    })
    var data = await raw.json();    
    $('#ward').append('<option value="" disabled selected>Phường/xã</option>');
    for (let ward of data) {
        $('#ward').append(
            `
                <option value="${ward.wardId}">${ward.wardName}</option>
            `
        )
    }
}


const db=require('./db')

exports.getAllProvinces=async function() {
    var query = `
    SELECT province_id as "provinceId",name as "provinceName"
    FROM province
    `;
    var data = await db.getQuery(query);
    return data;
}

exports.getAllDistricts=async function(provinceId) {
    var query = `
    SELECT district_id as "districtId",name as "districtName"
    FROM district
    WHERE province_id='${provinceId}'
    `;
    var data = await db.getQuery(query);
    return data;
}

exports.getAllWards=async function(districtId) {
    var query = `
    SELECT ward_id as "wardId",name as "wardName"
    FROM ward
    WHERE district_id='${districtId}'
    `;
    var data = await db.getQuery(query);
    return data;
}





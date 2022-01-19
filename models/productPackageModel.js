const {db, pgp} = require('./db');
const _db = require('./db');
const imageModel = require('./imageModel');
const DB = require('./db');

async function listProductPackage(min, max,s, sort,by, qPage) {
    const q = `select count(*) from productpackage_detail pd where p.productpackage_id = pd.productpackage_id`;
    let qSort = `khongdau(` + sort +`)`;
    if (sort === 'quantity') qSort = `(`+q+`)`;
    const qStr = `select p.*, (`+q+`) as quantity from productpackage p
    where (`+q+`) >`+min+` and (`+q+`) < ` + max + s +`
    order by ` + qSort + by;
    try{
        const listProductPackage  =  await _db.getQuery(qStr+qPage);
        const listAllProductPackage  =  await _db.getQuery(qStr);
        listProductPackage.count = listAllProductPackage.length;
        return listProductPackage;
    } catch(e){console.log(e)}
    return null;
}

async function productPackageDetail(id){
    const table = new pgp.helpers.TableName({table: 'productpackage', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1  where $2:name = $3`, [table, "productpackage_id", id]);
    try{
        const productPackage  =  await db.any(qStr);
        return productPackage;
    } catch(e){console.log(e)}
    return null;
}

async function productPackageDetailList(id){
    const qStr = `select * from productpackage_detail pd join product p on p.product_id = pd.product_id 
    where pd.productpackage_id = '`+id+`'`;
    try{
        const listProduct  =  await _db.getQuery(qStr);
        for (product of listProduct){
            product.images = await imageModel.imageList(product.product_id);
            product.image = product.images[0];
        }
        return listProduct;

    } catch(e){console.log(e)}
    return null;
}

function productPackageIdGeneration() {
    return `PT${Date.now().toString(16)}`
}

async function createProductPackage(ppName, ppQuantity, ppTimeLimit, ppLimitPerPerson) {
    let newProductId = productPackageIdGeneration();
    let createProductPackageQuery = `
        INSERT INTO product (product_id,name,quantity,time_limit,limit_per_person)
        VALUES ('${newProductId}','${ppName}','${ppQuantity}','${ppTimeLimit}','${ppLimitPerPerson})    
    `
    await DB.executeQuery(createProductPackageQuery);
}

async function editProductPackage(productPackageId, ppName, ppQuantity, ppTimeLimit, ppLimitPerPerson) {
    let editProductPackageQuery = `
        UPDATE product
        SET name='${ppName}', quantity=${ppQuantity}, time_limit=${ppTimeLimit}, limit_per_person=${ppLimitPerPerson}
        WHERE productpackage_id='${productPackageId}';
    `
    await DB.executeQuery(editProductPackageQuery);
}

async function getProductPackageById(productPackageId) {
    let query=`
        SELECT productpackage_id as "productPackageId", name, quantity, time_limit, limit_per_person  
        FROM productpackage
        WHERE productpackage_id='${productPackageId}'
    `
    let data = await DB.getOne(query);
    return data;
}

async function deleteProductPackage(productPackageId){
    let deleteProductPackageQuery = `
        DELETE FROM productpackage
        WHERE productpackage_id='${productPackageId}';
    `
    await DB.executeQuery(deleteProductPackageQuery);
}

module.exports={
    listProductPackage,
    productPackageDetailList,
    productPackageDetail,
    createProductPackage,
    editProductPackage,
    deleteProductPackage,
    getProductPackageById
}
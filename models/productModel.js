const {db, pgp} = require('./db');
const imageModel = require('./imageModel');
const DB = require("./db");

async function listProduct(price, s, sort, qPage) {
    const table = new pgp.helpers.TableName({table: 'product', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1 `+ price + s + sort + qPage, [table]);
    const qSt =  pgp.as.format(`Select * From $1 `+ price + s + sort, [table]);
    try{
        const listProduct  =  await db.any(qStr);
        const listAllProduct  =  await db.any(qSt);
        listProduct.count = listAllProduct.length;
        for (product of listProduct){
            product.images = await imageModel.imageList(product.product_id);
            product.image = product.images[0];
        }
        return listProduct;
    } catch(e){console.log(e)}
    return null;
}  

function productIdGeneration() {
    return `PT${Date.now().toString(16)}`
}

async function createProduct(name,price,unit) {
    let newProductId = productIdGeneration();
    let createProductQuery = `
        INSERT INTO product (product_id,name,price,unit)
        VALUES ('${newProductId}','${name}',${price},'${unit}')    
    `
    await DB.executeQuery(createProductQuery);

    let today=new Date().toISOString().split('T')[0];
    let newProductChangeId = Date.now().toString(16);
    let productChangeQuery = `
        INSERT INTO product_change_history (product_change_id, product_id, date)
        VALUES ('${newProductChangeId}','${newProductId}','${today}')
    `
    await DB.executeQuery(productChangeQuery);

    let image_id=Date.now().toString(16);
    let imageUrl=image_id;

    let imageChangeQuery = `
        INSERT INTO image (image_id, product_id, url)
        VALUES ('${image_id}','${productId}','${imageUrl}')
    `
    await DB.executeQuery(imageChangeQuery);
}

async function editProduct(productId, name, price, unit) {
    let editProductQuery = `
        UPDATE product
        SET name='${name}', price=${price}, unit='${unit}'
        WHERE product_id='${productId}';
    `
    await DB.executeQuery(editProductQuery);
}

async function getProductById(productId) {
    let query=`
        SELECT product_id as "productId", name, price, unit
        FROM product
        WHERE product_id='${productId}'
    `
    let data = await DB.getOne(query);
    return data;
}

async function deleteProduct(productId){
    let deleteProductQuery = `
        DELETE FROM product
        WHERE product_id='${productId}';
    `
    await DB.executeQuery(deleteProductQuery);
}

module.exports={
    listProduct,
    createProduct,
    editProduct,
    deleteProduct,
    getProductById
}
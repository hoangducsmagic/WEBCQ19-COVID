const {db, pgp} = require('./db');

exports.listProduct = async(price, s, sort, qPage) =>{
    const table = new pgp.helpers.TableName({table: 'product', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1 `+ price + s + sort + qPage, [table]);
    const qSt =  pgp.as.format(`Select * From $1 `+ price + s + sort, [table]);
    try{
        const listProduct  =  await db.any(qStr);
        const listAllProduct  =  await db.any(qSt);
        listProduct.count = listAllProduct.length;
        return listProduct;
    } catch(e){console.log(e)}
    return null;
}  

exports.productDetail = async(id) =>{
    const table = new pgp.helpers.TableName({table: 'product', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1  where $2:name = $3`, [table, "Product_ID", id]);
    try{
        const product  =  await db.any(qStr);
        return product;
    } catch(e){console.log(e)}
    return null;
}

const {db, pgp} = require('./db');

exports.listProductPackage = async(price, s, sort, qPage) =>{
    const table = new pgp.helpers.TableName({table: 'productPackage', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1 ` + price + s + sort + qPage, [table]);
    const qSt =  pgp.as.format(`Select * From $1 `+ price + s + sort, [table]);
    try{
        const listProductPackage  =  await db.any(qStr);
        const listAllProductPackage  =  await db.any(qSt);
        listProductPackage.count = listAllProductPackage.length;
        return listProductPackage;
        
    } catch(e){console.log(e)}
    return null;
}  

exports.productPackageDetail = async(id) =>{
    const table = new pgp.helpers.TableName({table: 'productPackage', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1  where $2:name = $3`, [table, "ProductPackage_ID", id]);
    try{
        const productPackage  =  await db.any(qStr);
        return productPackage;
    } catch(e){console.log(e)}
    return null;
}

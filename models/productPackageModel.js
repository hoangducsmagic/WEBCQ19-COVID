const {db, pgp} = require('./db');
const _db = require('./db');
const imageModel = require('./imageModel');

exports.listProductPackage = async(min, max,s, sort,by, qPage) =>{
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

exports.productPackageDetail = async(id) =>{
    const table = new pgp.helpers.TableName({table: 'productpackage', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1  where $2:name = $3`, [table, "productpackage_id", id]);
    try{
        const productPackage  =  await db.any(qStr);
        return productPackage;
    } catch(e){console.log(e)}
    return null;
}

exports.productPackageDetailList = async(id) =>{
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

const {db, pgp} = require('./db');
const imageModel = require('./imageModel');

exports.listProduct = async(price, s, sort, qPage) =>{
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

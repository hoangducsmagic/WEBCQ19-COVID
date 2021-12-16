const {db, pgp} = require('./db')

exports.imageList = async(product_id) =>{
    const table = new pgp.helpers.TableName({table: 'image', schema: 'public'})
    const qStr = pgp.as.format(`Select * From $1  where $2:name = $3`, [table, "product_id", product_id]);
    try{
        const images  =  await db.any(qStr);
        return images;
    } catch(e){console.log(e)}
    return null;
}
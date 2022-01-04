const productModel = require('../models/productModel');

exports.dummy = (req,res) => {
    res.send("DUMMY FUNCTION")
}

exports.listProduct = async (req, res) => {
    const price = ` where price >` + (req.query.min || 0) + ` and price <` + (req.query.max || 1000000000);
    let s = ` and lower(khongdau(name)) like lower(khongdau('%` + req.query.s+`%'))`;
    if (!req.query.s) s=``;
    let sort =  `order by khongdau("`+req.query.sort+`") `+ (req.query.by||``);
    if (req.query.sort && req.query.sort === 'price')
        sort =  `order by `+req.query.sort+` `+ (req.query.by||``);
    if (!req.query.sort) sort =  `order by product_id`;
    const perPage = req.query.perPage || 30;
    const page = req.query.page || '1';
    const qPage = ` limit ` + perPage + ` offset ` + (parseInt(req.query.page-1)*parseInt(perPage) || 0);
    const listProduct = await productModel.listProduct(price ,s, sort, qPage);
    let min='', max='', by='';
    if (s!='') s='&s='+req.query.s;
    if (sort!='') sort='&sort='+req.query.sort;
    if (req.query.by && req.query.by!='') by='&by='+req.query.by;
    if (req.query.min) min='&min='+req.query.min;
    if (req.query.max) max='&max='+req.query.max;
    let viewUrlName = 'productList';
    if (req.user.role === 'manager')
        viewUrlName = 'productListManage'
    if (listProduct && listProduct.count > 0)
    res.render('products/'+viewUrlName, {listProduct: listProduct, 
        s: s,
        search: req.query.s || "",
        min: min,
        max: max,
        minS: req.query.min || 0,
        maxS: req.query.max || 1000000000,
        sort: sort,
        by: by,
        prevPage: parseInt(page) - 1,
        nextPage: parseInt(page) + 1,
        hasPrevPage: page!='1',
        hasNextPage: page!=(Math.floor((parseInt(listProduct.count)+parseInt(perPage)-1)/ parseInt(perPage))),
        lastPage: (Math.floor((parseInt(listProduct.count)+parseInt(perPage)-1)/ parseInt(perPage))),
        firstPage: 1,
        curPage: page,
        perPage: perPage
    });
    else 
    res.render('products/'+viewUrlName, {doNotList: true});
}
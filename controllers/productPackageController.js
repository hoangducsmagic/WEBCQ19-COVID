const { listProduct } = require('../models/productModel');
const productPackageModel = require('../models/productPackageModel');
const productModel = require('../models/productModel');

exports.dummy = (req, res) => {
    res.send('DUMMY');
}

exports.listProductPackage = async (req, res) => {
    const price = ` where "PriceTotal" >` + (req.query.min || 0) + ` and "PriceTotal" <` + (req.query.max || 1000000000);
    let s = ` and lower(khongdau("Name")) like lower(khongdau('%` + req.query.s+`%'))`;
    if (!req.query.s) s=``;
    let sort =  `order by khongdau("`+req.query.sort+`") `+ (req.query.by||``);
    if (req.query.sort && req.query.sort === "Price")
        sort =  `order by "`+req.query.sort+`Total" `+ (req.query.by||``);
    if (!req.query.sort) sort=``;
    const perPage = req.query.perPage || 30;
    const page = req.query.page || '1';
    const qPage = ` limit ` + perPage + ` offset ` + (parseInt(req.query.page-1)*parseInt(perPage) || 0);
    const listProductPackage = await productPackageModel.listProductPackage(price ,s, sort, qPage);
    let min = '', max ='', by='';
    if (s!='') s='&s='+req.query.s;
    if (sort!='') sort='&sort='+req.query.sort;
    if (req.query.by && req.query.by!='') by='&by='+req.query.by;
    if (req.query.min) min='&min='+req.query.min;
    if (req.query.max) max='&max='+req.query.max;
    if (listProductPackage && listProductPackage.length > 0)
    res.render('productPackages/productPackageListManage', {listProductPackage: listProductPackage, 
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
        hasNextPage: page!=(Math.floor((parseInt(listProductPackage.count)+parseInt(perPage)-1)/ parseInt(perPage))),
        lastPage: (Math.floor((parseInt(listProductPackage.count)+parseInt(perPage)-1)/ parseInt(perPage))),
        firstPage: 1,
        curPage: page,
        perPage: perPage
    });
    else 
    res.render('productPackages/productPackageList', {doNotList: true});
}

exports.productPackageDetail = async (req, res) => {
    const id = req.params.id;
    const productPackage = await productPackageModel.productPackageDetail(parseInt(id));
    if (productPackage){
        let listProduct = [];
        for (let i=0; i< productPackage[0].Product_ID_List.length; i++){
            const product_ID = productPackage[0].Product_ID_List[i];
            const product = await productModel.productDetail(product_ID);
            product[0].Quantity = productPackage[0].Product_Quantity_List[i];
            listProduct.push(product[0]);
        }
        res.render('productPackages/productListOfPackage', {listProduct: listProduct, productPackage: productPackage[0]});
    }
    else
    res.render('productPackages/productPackageDetail', {doNot: true});
}
const productModel = require('../models/productModel');

async function dummy(req,res) {
    res.send("DUMMY FUNCTION")
}

async function listProduct(req, res) {
    if (req.user.role!='manager') return redirect('/');
    const price = ` where price >=` + (req.query.min || 0) + ` and price <=` + (req.query.max || 1000000000);
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
    let viewUrlName = 'productListManage';
    
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

async function productDetail (req,res) {
    if (req.user.role!='manager') return redirect('/');
    const id = req.params.id;
    const product = await productModel.getProduct(id);
    if (product) res.render('products/productDetail', {product:product})
    else
    res.render('products/productDetail', {doNotList:true})
}

async function showCreateProductPage(req, res) {
    if (req.user.role!='manager') return redirect('/');
    res.render('products/createProduct')
}


async function createProduct(req, res) {
    if (req.user.role!='manager') return redirect('/');
    const {name, price, unit} = req.body;
    await productModel.createProduct(name, price, unit);
    res.redirect('/products');
}

async function showUpdateProductPage(req, res){
    if (req.user.role!='manager') return redirect('/');
    let productInfo = await productModel.getProductById(req.params.id);
    res.render('products/editProduct', {
        ...productInfo,
        productId:req.params.id
    })
}

async function editProduct(req, res) {
    if (req.user.role!='manager') return redirect('/');
    const productId = req.params.id;
    const {name, price, unit} = req.body;
    await productModel.editProduct(productId, name, price, unit);
    res.redirect('/products');
}

async function deleteProduct(req, res) {
    if (req.user.role!='manager') return redirect('/');
    const productId = req.params.id;
    await productModel.deleteProduct(productId);
    res.redirect('/products');
}

module.exports={
    showCreateProductPage,
    createProduct,
    editProduct,
    deleteProduct,
    showUpdateProductPage,
    listProduct,
    productDetail,
    dummy
}
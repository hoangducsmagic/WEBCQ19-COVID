const productPackageModel = require('../models/productPackageModel');

async function dummy(req, res){
    res.send('DUMMY');
}

async function listProductPackage(req, res) {
    let s = ` and lower(khongdau(name)) like lower(khongdau('%` + req.query.s+`%'))`;
    if (!req.query.s) s=``;
    let sort =  req.query.sort || `productpackage_id`;
    let by = req.query.by||``;
    const perPage = req.query.perPage || 30;
    const page = req.query.page || '1';
    const qPage = ` limit ` + perPage + ` offset ` + ((parseInt(page) -1)*parseInt(perPage));
    const listProductPackage = await productPackageModel.listProductPackage(parseInt(req.query.min||0), parseInt(req.query.max||1000) ,s, sort, by, qPage);
    let min = '', max ='';
    if (s!='') s='&s='+req.query.s;
    sort='&sort='+sort;
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

async function productPackageDetail(req, res) {
    const id = req.params.id;
    const productPackage = await productPackageModel.productPackageDetail(id);
    if (productPackage){
        const listProduct =  await productPackageModel.productPackageDetailList(id)
        res.render('productPackages/productListOfPackage', {listProduct: listProduct, productPackage: productPackage[0]});
    }
    else
    res.render('productPackages/productPackageDetail', {doNot: true});
}

async function showCreateProductPackagePage(req, res) {
    res.render('productPackages/createProductPackage');
}


async function createProductPackage(req, res) {
    const {name, quantity, time_limit, limit_per_person} = req.body;
    await productPackageModel.createProductPackage(name, quantity, time_limit, limit_per_person);
    res.redirect('/productPackages');
}

async function showEditProductPackagePage(req, res){
    let productPackageInfo = await productPackageModel.getProductPackageById(req.params.id);
    res.render('productPackages/editProductPackage', {
        ...productPackageInfo,
        productPackageId:req.params.id
    })
}

async function editProductPackage(req, res) {
    const productPackageId = req.params.id;
    const {name, quantity, time_limit, limit_per_person} = req.body;
    await productPackageModel.editProductPackage(productPackageId, name, quantity, time_limit, limit_per_person);
    res.redirect('/productPackages');
}

async function deleteProductPackage(req, res) {
    const productPackageId = req.params.id;
    await productPackageModel.deleteProductPackage(productPackageId);
    res.redirect('/productPackages');
}

module.exports={
    dummy,
    listProductPackage,
    productPackageDetail,
    showCreateProductPackagePage,
    showEditProductPackagePage,
    createProductPackage,
    editProductPackage,
    deleteProductPackage
}
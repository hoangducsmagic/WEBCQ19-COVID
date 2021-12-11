const Statistic=require('../models/statisticModel')

async function showPackageConsumptionPage(req, res) {
    res.render("statistic/packageConsumption");
}

async function showProductConsumptionPage(req, res) {
    res.render("statistic/productConsumption");
}

async function showTotalCasesPage(req, res) {
    res.render("statistic/totalCases");
}

async function showStatusChangePage(req, res) {
    var dateFrom = req.query.inputFromDate;
    var dateTo = req.query.inputToDate;

    var data = await Statistic.getStatusChangeData(dateFrom,dateTo);
    res.render("statistic/statusChange",{
        ...data,
        dateFrom,
        dateTo
    });
}

module.exports = {
    showPackageConsumptionPage,
    showProductConsumptionPage,
    showTotalCasesPage,
    showStatusChangePage
};

const Statistic = require("../models/statisticModel");

async function showPackageConsumptionPage(req, res) {
    res.render("statistic/packageConsumption");
}

async function showProductConsumptionPage(req, res) {
    var data = await Statistic.getProductConsumption();
    res.render("statistic/productConsumption", { productConsumptionList:data});
}

async function showTotalCasesPage(req, res) {
    var dateFrom = req.query.inputFromDate;
    var dateTo = req.query.inputToDate;

    var data = await Statistic.getTotalCases(dateFrom, dateTo);

    res.render("statistic/totalCases", { statusList: data, dateFrom, dateTo });
}

async function showStatusChangePage(req, res) {
    var dateFrom = req.query.inputFromDate;
    var dateTo = req.query.inputToDate;

    var data = await Statistic.getStatusChangeData(dateFrom, dateTo);

    res.render("statistic/statusChange", {
        changedList: data,
        dateFrom,
        dateTo,
    });
}

module.exports = {
    showPackageConsumptionPage,
    showProductConsumptionPage,
    showTotalCasesPage,
    showStatusChangePage,
};

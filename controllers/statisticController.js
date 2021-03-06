const Statistic = require('../models/statisticModel');

async function showPackageConsumptionPage(req, res) {
	var data = await Statistic.getPackageConsumption();
	res.render('statistic/packageConsumption', { packageConsumptionList: data });
}

async function showProductConsumptionPage(req, res) {
	var data = await Statistic.getProductConsumption();
	res.render('statistic/productConsumption', { productConsumptionList: data });
}

async function showTotalCasesPage(req, res) {
	var dateFrom = req.query.inputFromDate;
	var dateTo = req.query.inputToDate;

	var data = await Statistic.getTotalCases(dateFrom, dateTo);
	let chartData = data.map((item) => item['amount']).toString();
	res.render('statistic/totalCases', {
		statusList: data,
		dateFrom,
		dateTo,
		chartData,
	});
}

async function showStatusChangePage(req, res) {
	var dateFrom = req.query.inputFromDate;
	var dateTo = req.query.inputToDate;

	var data = await Statistic.getStatusChangeData(dateFrom, dateTo);

	res.render('statistic/statusChange', {
		...data,
		dateFrom,
		dateTo,
	});
}

async function showPaymentStatisticPage(req, res) {
	
	const boughtList = await Statistic.getBoughtList();
	res.render('statistic/debt', {
		
		boughtList,
	});
}

module.exports = {
	showPackageConsumptionPage,
	showProductConsumptionPage,
	showTotalCasesPage,
	showStatusChangePage,
	showPaymentStatisticPage,
};

import request from "./http";

export const login = (data) => {
	return request({
		url: '/user/login',
		data,
		method: 'POST'
	})
}


// 经营情况
export const getBusinessOverview = (data) => {
	return request({
		url: '/depotHead/getBusinessOverview',
		method: 'GET',
		data
	})
}

// packageA 页面
export const getEmployeePerformance = (data) => {
	return request({
		url: '/depotHead/getEmployeePerformance',
		method: 'GET',
		data
	})
}

// packageB 销售接口
export const getDepotHeadList = (data) => {
	return request({
		url: '/depotHead/list',
		method: 'GET',
		data
	})
}

export const getDetailByNumbe = (data) => {
	return request({
		url: '/depotHead/getDetailByNumber',
		method: 'GET',
		data
	})
}


export const getUserByDepotId = (data) => {
	return request({
		url: '/user/getUserByDepotId',
		method: 'GET',
		data
	})
}

export const getDepotByUserId = (data) => {
	return request({
		url: '/user/getDepotByUserId',
		method: 'GET',
		data
	})
}

// getAccountByDepotId
export const getAccountByDepotId = (data) => {
	return request({
		url: '/account/getAccountByDepotId',
		method: 'GET',
		data
	})
}


// packageC 商品
export const getMaterialList = (data) => {
	return request({
		url: '/material/list',
		method: 'GET',
		data
	})
}



// packageE 更多
export const getCapitalFlow = (data) => {
	return request({
		url: '/depotHead/getCapitalFlow',
		method: 'GET',
		data
	})
}


export const getInOutinfoList = (data) => {
	return request({
		url: '/inOutItem/infoList',
		method: 'GET',
		data
	})
}

// 
export const getSalesStatistics = (data) => {
	return request({
		url: '/depotItem/salesStatistics',
		method: 'GET',
		data
	})
}

// material/getStock
export const getStockList = (data) => {
	return request({
		url: '/material/getStock',
		data,
		method: 'GET'
	})
}
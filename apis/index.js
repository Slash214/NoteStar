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


// packageB 销售接口
export const getDepotHeadList = (data) => {
	return request({
		url: '/depotHead/list',
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
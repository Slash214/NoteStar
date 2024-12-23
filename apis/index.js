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

// 热销商品
export const getHotSellingGoods = (data) => {
	return request({
		url: '/depotHead/getHotSellingGoods',
		method: 'GET',
		data
	})
}


// 店铺
export const getDepotList = (data) => {
	return request({
		url: '/depot/list',
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

// getAccountByDepotId 获取账号
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

// 条形码
export const getMaxBarCode = (data) => {
	return request({
		url: '/material/getMaxBarCode ',
		method: 'GET',
		data
	})
}

// 增加商品
export const addMaterial = (data) => {
	return request({
		url: '/material/add',
		method: 'POST',
		data
	})
}

// 更新商品
export const updateMaterial = (data) => {
	return request({
		url: '/material/update',
		method: 'PUT',
		data
	})
}

export const deleteMaterial = (data) => {
	return request({
		url: '/material/delete',
		method: 'GET',
		data
	})
}

// 获取商品id
export const getMaterById = (data) => {
	return request({
		url: '/material/findById',
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

// 获取商品库存
export const getStockDetail = (data) => {
	return request({
		url: '/material/getStockDetail',
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


// 开单接口
export const addDepotHeadAndDetail = (data, url = '/depotHead/addDepotHeadAndDetail') => {
	return request({
		url,
		data,
		method: 'POST'
	})
}

// 作废单据
export const deleteDepotHead = (data) => {
	return request({
		url: '/depotHead/delete',
		data,
		method: 'GET'
	})
}


// 生成订单号
export const genbuildNumber = (data) => {
	return request({
		url: '/sequence/buildNumber',
		data,
		method: 'GET'
	})
}

// 更新开单
export const updateDepotHeadAndDetail = (data) => {
	return request({
		url: '/depotHead/updateDepotHeadAndDetail',
		data,
		method: 'PUT'
	})
}


// inOutItem/add
export const addinOutItem = (data) => {
	return request({
		url: '/inOutItem/add',
		data,
		method: 'POST'
	})
}

export const updateinOutItem = (data) => {
	return request({
		url: '/inOutItem/update',
		data,
		method: 'PUT'
	})
}


export const getDetailByNumber = (data) => {
	return request({
		url: '/inOutItem/getDetailByNumber',
		data,
		method: 'GET'
	})
}

export const deleteInOutItem = (data) => {
	return request({
		url: '/inOutItem/delete',
		data,
		method: 'GET'
	})
}

export const deleteAccountItem = (data) => {
	return request({
		url: '/account/delete',
		data,
		method: 'GET'
	})
}

export const addAccountItem = (data) => {
	return request({
		url: '/account/addAccount',
		data,
		method: 'POST'
	})
}


// 开单历史记录
export const getHistoryDetailByNumber = (data) => {
	return request({
		url: '/depotHead/getHistoryDetailByNumber',
		method: 'GET',
		data
	})
}



// 获取商品销售详细的
export const getMaterialSalesDetails = (data) => {
	return request({
		url: '/depotItem/getMaterialSalesDetails',
		data,
		method: 'GET'
	})
}


export const getCapitalFlowDetail = (data) => {
	return request({
		url: '/depotHead/getCapitalFlowDetail',
		data,
		method: 'GET'
	})
}


export const addShopDataDeopt = (data) => {
	return request({
		url: '/depot/add',
		data,
		method: 'POST'
	})
}

export const updateShopDataDeopt = (data) => {
	return request({
		url: '/depot/update',
		data,
		method: 'PUT'
	})
}



export const addUserData = (data) => {
	return request({
		url: '/user/addUser',
		data,
		method: 'POST'
	})
}

export const updateUserData = (data) => {
	return request({
		url: '/user/updateUser',
		data,
		method: 'PUT'
	})
}

// 获取角色列表
export const getRoleList = (data) => {
	return request({
		url: '/role/list',
		data,
		method: 'GET'
	})
}

export const getUserByUserId = (data) => {
	return request({
		url: '/user/getUserByUserId',
		data,
		method: 'GET'
	})
}

// 删除门店
export const deleteShopMang = (data) => {
	return request({
		url: '/depot/delete',
		data,
		method: 'GET'
	})
}


export const conversionData = (data) => {
	return request({
		url: '/depotHead/transferOrder',
		data,
		method: 'POST'
	})
}
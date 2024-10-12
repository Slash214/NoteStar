import request from "./http";

export const login = (data) => {
	return request({
		url: '/user/login',
		data,
		method: 'POST'
	})
}
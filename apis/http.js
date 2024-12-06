import {
	BASE_URL
} from '@/common/contanst.js'
const request = (options) => {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token') || ''
		const {
			data,
			method = 'GET',
			header = {},
			url
		} = options;

		// 合并默认请求头和自定义请求头
		const headers = {
			'Content-Type': 'application/json',
			...header,
		};
		headers['X-Access-Token'] = token

		// 处理请求方法，统一转换为大写
		const requestMethod = method.toUpperCase();

		// 非 GET 请求且有数据时，将数据序列化为 JSON 字符串
		const requestData =
			data && requestMethod !== 'GET' ? JSON.stringify(data) : data;

		uni.request({
			...options,
			url: BASE_URL + url,
			method: requestMethod,
			data: requestData,
			header: headers,
			success: function(res) {
				if (res.statusCode === 200) {
					if (res.data.code === 0) {
						resolve(res.data);
					} else {
						// 可以根据需要在这里处理业务错误
						reject(res.data);

						if (res.data?.message === 'token过期') {
							uni.clearStorageSync()
							uni.reLaunch({
								url: '/pages/login/login'
							})
							return
						}

						uni.showToast({
							title: res.data?.message || '服务错误',
							icon: 'none'
						})

					}
				} else {
					// 处理 HTTP 状态码错误
					reject({
						code: res.statusCode,
						message: `网络请求错误，状态码：${res.statusCode}`,
						data: res.data,
					});
				}
			},
			fail: function(error) {
				// 处理请求失败
				reject({
					code: 0,
					message: '网络请求失败',
					error: error,
				});
			},
		});
	});
};

export default request;
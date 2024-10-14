/**
 * 将日期转换为 "YYYY年MM月DD日 星期X" 格式的字符串
 * @param {Date | string | number} inputDate - 输入的日期，可以是 Date 对象、日期字符串或时间戳
 * @returns {string} 格式化后的日期字符串
 */
export
/**
 * 将日期转换为 "YYYY年MM月DD日 星期X" 格式的字符串
 * @param {Date | string | number} inputDate - 输入的日期，可以是 Date 对象、日期字符串或时间戳
 * @returns {string} 格式化后的日期字符串
 */
function formatDateToChinese(inputDate) {
	let date;

	if (typeof inputDate === 'string') {
		// 检查是否为 "yyyy-MM-dd HH:mm:ss" 格式
		const isoFormat = inputDate.replace(' ', 'T');
		date = new Date(isoFormat);

		// 如果解析失败，尝试手动解析
		if (isNaN(date.getTime())) {
			// 手动解析 "yyyy-MM-dd HH:mm:ss"
			const parts = inputDate.split(' ');
			if (parts.length === 2) {
				const dateParts = parts[0].split('-').map(part => parseInt(part, 10));
				const timeParts = parts[1].split(':').map(part => parseInt(part, 10));
				if (dateParts.length === 3 && timeParts.length === 3) {
					// 注意：月份从0开始
					date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[
						2]);
				}
			}
		}
	} else {
		// 对于 Date 对象或时间戳，直接创建 Date
		date = new Date(inputDate);
	}

	// 检查日期是否有效
	if (isNaN(date.getTime())) {
		return '无效日期';
	}

	// 获取年、月、日
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 月份从0开始，需要加1
	const day = date.getDate();

	// 获取星期几
	const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	const weekday = weekdays[date.getDay()];

	// 格式化月份和日期，确保两位数显示（例如：04月，09日）
	const formattedMonth = month < 10 ? `0${month}` : `${month}`;
	const formattedDay = day < 10 ? `0${day}` : `${day}`;

	// 组合最终字符串
	return `${year}.${formattedMonth}.${formattedDay} ${weekday}`;
}

/**
 * 将字符串或数字转换为金钱格式 "XXX,XXX.00"
 * @param {string | number} value - 输入的字符串或数字
 * @returns {string} 格式化后的金钱字符串
 */
export function formatMoney(value) {
	// 如果输入是字符串，移除其中的逗号并转换为浮点数
	let number;
	if (typeof value === 'string') {
		// 移除所有逗号，以防输入中已经包含逗号
		const cleanedValue = value.replace(/,/g, '');
		number = parseFloat(cleanedValue);
	} else if (typeof value === 'number') {
		number = value;
	} else {
		// 如果输入既不是字符串也不是数字，返回错误信息
		return 'Invalid input type';
	}

	// 检查转换后的数字是否有效
	if (isNaN(number)) {
		return 'Invalid number';
	}

	// 保留两位小数
	const fixedNumber = number.toFixed(2);

	// 分割整数部分和小数部分
	const parts = fixedNumber.split('.');
	let integerPart = parts[0];
	const decimalPart = parts[1];

	// 使用正则表达式在整数部分添加逗号作为千分位分隔符
	const regex = /\B(?=(\d{3})+(?!\d))/g;
	integerPart = integerPart.replace(regex, ',');

	// 组合整数部分和小数部分
	return `${integerPart}.${decimalPart}`;
}
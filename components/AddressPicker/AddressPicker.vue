<template>
	<view class="boxs">
		<picker  mode="multiSelector" :range="range" :value="value" @change="onChange" @columnchange="onColumnChange">
			<view>{{ selectedAddress }}</view>
		</picker>
	</view>
</template>

<script>
export default {
	name: 'AddressPicker',
	props: {},
	data() {
		return {
			range: [[], [], []], // 存储省、市、区的数据
			value: [0, 0, 0], // 默认选中的索引
			selectedAddress: '', // 选中的地址显示
			provinces: [], // 省份数据
			cities: [], // 城市数据
			districts: [], // 区县数据,
			jsonData: {}
		}
	},
	created() {
		this.fetchData()
	},

	methods: {
		fetchData() {
			const url = 'https://haoxianhui.com/hxh/2024/11/26/f1b6282851bd4fa7b162820b6120ab0f.json'
			uni.request({
				url,
				method: 'GET',
				dataType: 'json',
				success: (res) => {
					if (res.statusCode === 200) {
						this.jsonData = res.data
						this.initAddressData()
					} else {
						console.error('请求失败，状态码：', res.statusCode)
					}
				},
				fail: (err) => {
					console.error('请求错误：', err)
				}
			})
		},
		transformData(rawData) {
			const provinces = []
			for (const provinceName in rawData) {
				const province = {
					name: provinceName,
					cities: []
				}
				const citiesObj = rawData[provinceName]
				for (const cityName in citiesObj) {
					const city = {
						name: cityName,
						districts: citiesObj[cityName]
					}
					province.cities.push(city)
				}
				provinces.push(province)
			}
			return provinces
		},
		// 初始化地址数据
		initAddressData() {
		  this.provinces = this.transformData(this.jsonData);
		
		  // 找到四川省的索引
		  const provinceIndex = this.provinces.findIndex(
		    (item) => item.name === '四川省'
		  );
		
		  // 如果找不到四川省，默认为第一个省份
		  const pIndex = provinceIndex !== -1 ? provinceIndex : 0;
		  this.cities = this.provinces[pIndex].cities;
		
		  // 找到成都市的索引
		  const cityIndex = this.cities.findIndex(
		    (item) => item.name === '成都市'
		  );
		
		  // 如果找不到成都市，默认为第一个城市
		  const cIndex = cityIndex !== -1 ? cityIndex : 0;
		  this.districts = this.cities[cIndex].districts;
		
		  // 找到双流区的索引
		  const districtIndex = this.districts.findIndex(
		    (item) => item === '双流区'
		  );
		
		  // 如果找不到双流区，默认为第一个区县
		  const dIndex = districtIndex !== -1 ? districtIndex : 0;
		
		  // 设置默认选中的索引
		  this.value = [pIndex, cIndex, dIndex];
		
		  // 设置 range 数据
		  this.range[0] = this.provinces.map((item) => item.name);
		  this.range[1] = this.cities.map((item) => item.name);
		  this.range[2] = this.districts;
		
		  // 设置默认显示的地址
		  const provinceName = this.provinces[pIndex].name;
		  const cityName = this.cities[cIndex].name;
		  const districtName = this.districts[dIndex];
		  this.selectedAddress = `${provinceName}-${cityName}-${districtName}`;
		},
		// 列改变时触发
		onColumnChange(e) {
			const { column, value } = e.detail
			this.value[column] = value
			if (column === 0) {
				this.cities = this.provinces[value].cities
				this.districts = this.cities[0].districts
				this.range[1] = this.cities.map((item) => item.name)
				this.range[2] = this.districts
				this.value[1] = 0
				this.value[2] = 0
			} else if (column === 1) {
				this.districts = this.cities[value].districts
				this.range[2] = this.districts
				this.value[2] = 0
			}
		},
		// 选择完成时触发
		onChange(e) {
			const [pIndex, cIndex, dIndex] = e.detail.value
			const province = this.provinces[pIndex].name
			const city = this.cities[cIndex].name
			const district = this.districts[dIndex]
			this.selectedAddress = `${province}-${city}-${district}`
			// 将选中的地址信息传递给父组件
			this.$emit('select', {
				province,
				city,
				district
			})
		}
	}
}
</script>

<style scoped lang="scss">
.boxs {
	font-size: 28rpx;
}

</style>

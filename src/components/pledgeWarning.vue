<!--质押告警状态操作-->
<template>
	<div class="warning">
		<div class="warning_title">
			<div class="line"></div>
			<div class="w_title">质押告警</div>
		</div>
		<div class="warn_coin">
			<div class="left">
				<div class="contain">
					<div class="t_status">
						<img src="@/assets/images/status.png" alt />质押物监管状态
					</div>
					<div class="desc">
						<div>
							<img src="@/assets/images/red.png" alt />正常监管中
						</div>
						<div>
							<img src="@/assets/images/yellow.png" alt />质押物监管状态异常、预警
						</div>
						<div>
							<img src="@/assets/images/green.png" alt />仓库解押、可以移动货物
						</div>
					</div>
					<p>
						<span class="operate">仓库解押操作：</span>
						<el-button class="lock" size="small" @click="solute(0)" :disabled="isDisabled" :loading="isLoading" v-if="isFactive">解押</el-button>
						<el-button class="unlock" size="small" :disabled="isDisabled" :loading="isLoading" @click="solute(1)" v-else>恢复监管</el-button>
					</p>
				</div>
			</div>
			<div class="right">
				<div>
					<img :src="isFactive ? redImg : defaultImg" alt />
				</div>
				<div>
					<img :src="isSactive ? yellowImg : defaultImg" alt />
				</div>
				<div>
					<img :src="isTactive ? greenImg : defaultImg" alt />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import * as api from "@/common/api"; //引入接口
	export default {
		data() {
			return {
				loadingTimer: "", //按钮的定时器
				isDisabled: false, //按钮的禁用状态
				isLoading: false, //按钮的loading加载锁定状态
				isFactive: "", //解押红色
				isSactive: false, //灰色
				isTactive: "", // 灰色
				redImg: require("@/assets/images/active_red.png"),
				defaultImg: require("@/assets/images/default.png"),
				yellowImg: require("@/assets/images/active_yellow.png"),
				greenImg: require("@/assets/images/active_green.png")
			};
		},
		mounted() {
			// 获取当前仓库的解押状态 0---解锁，可以移动、1---锁定，监管中
			api.queryLockStatus().then(res => {
					if(res.data === 0) {
						//解押
						this.isFactive = false;
						this.isTactive = true;
					}
					if(res.data === 1) {
						//恢复解押-锁定
						this.isFactive = true;
						this.isTactive = false;
					}
				})
				.catch(err => {
					this.$message.error(err);
				});
		},
		beforeDestroy() {
			clearTimeout(this.loadingTimer); //销毁按钮计时
		},
		methods: {
			ifLoading() { //是否锁定按钮
				this.isFactive = !this.isFactive;
				this.isTactive = !this.isTactive;
				this.isLoading = !this.isLoading;
				this.isDisabled = false; //按钮恢复可点击
			},
			solute(value) {
				//解押---//点击解押-恢复解押，变色
				api.lockStore({
						locked: value
					}).then(res => {
						console.log(res);
						this.isDisabled = true; //点击按钮后，先使按钮不可点击
						if(res.data == true) {
							this.isLoading = !this.isLoading;
							this.loadingTimer = setTimeout(this.ifLoading, 3000); //3秒后可点按钮，恢复状态
						} else {
							this.$message.error(res.message);
						}
					})
					.catch(err => {
						this.$message.error(err);
					});
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "~@/styles/base.less";
	.warning {
		.warning_title {
			.flex-row("", flex-end);
			.line {
				.line();
			}
			.w_title {
				padding: 14px 0 6px 0;
				font-size: 16px;
				font-weight: bold;
				width: 90px;
				.border-bottom(4px, #00a0e9);
			}
		}
		.warn_coin {
			.flex-row(space-between);
			margin: 20px 40px 0 20px;
			.left {
				.contain {
					.t_status {
						font-size: 14px;
						.flex-row("", center);
						margin-bottom: 20px;
						img {
							margin-right: 5px;
						}
					}
					.desc {
						font-size: 12px;
						div {
							margin-bottom: 25px;
							font-family: "SimSun";
							img {
								margin-right: 10px;
							}
						}
					}
					p {
						.lock {
							font-size: 18px;
							text-align: left;
							font-weight: bold;
							color: #fff;
							background: #db3434;
							border: unset;
						}
						.unlock {
							font-size: 18px;
							text-align: left;
							font-weight: bold;
							color: #fff;
							background: #4de35c;
							border: unset;
						}
					}
				}
			}
		}
		.right {
			height: 160px;
			.flex-column(space-around, "");
		}
	}
</style>
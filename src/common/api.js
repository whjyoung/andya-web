//统一接口
import { post, get } from './ajax'
//资产行情热门模块接口
export function getHotQuotes(reqData) {
  return get("/api/capital/hot-quotes", reqData)
}
//资产行情质押物实时价值
export function getStockList(reqData) {
  return get("/api/capital/stock/list", reqData)
}
//质押权人统计接口数据
export function getPledgeStatistical(reqData) {
  return get("/api/web-index/pledge-statistical", reqData)
}
//仓库质押物数据统计
export function getStoreStatistical(reqData) {
  return get("/api/web-index/store-statistics", reqData)
}
//仓库信息(资产巡检)
export function getStoreMsg(reqData) {
  return get("/api/web-index/store-id", reqData)
}
//告警事件次数统计
export function getAlarmNnumberStatistical(reqData) {
  return get("/api/web-index/alarm-number-statistical", reqData)
}
//告警事件详情
export function getAlarmList(reqData) {
  return get("/api/web-index/alarm-list", reqData)
}
//告警事件类型统计
export function getAlarmTypeStatistical(reqData) {
  return get("/api/web-index/alarm-statistical", reqData)
}
//查询质押物告警仓库状态
export function queryLockStatus(reqData) {
  return get("/api/web-index/query-lock-status", reqData)
}
//解锁货物
export function lockStore(reqData) {
  return get("/api/web-index/lock-stock", reqData)
}
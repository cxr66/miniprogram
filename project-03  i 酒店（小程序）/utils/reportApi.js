
const reportApi = {
  report_arrange_detail_list: `report/comprehensive/report_arrange_detail_list/`, // 冲调账报表
  report_ar_charge_summary_by_date: `report/comprehensive/report_ar_charge_summary_by_date/`, // *AR入账简表
  report_ar_account_real_time: `report/comprehensive/report_ar_account_real_time/`, // *AR账户实时余额表
  3: ``, // AR账户收款汇总表
  report_ar_account_pay_details: `report/comprehensive/report_ar_account_pay_details/`, // *AR付款明细
  report_ar_pay_summary_by_date: `report/comprehensive/report_ar_pay_summary_by_date/`, // *AR收款简表
  report_ar_account_charge_details: `report/comprehensive/report_ar_account_charge_details/`, // *AR入账明细报表
  7: ``, // 催账报表
  8: ``, // 结账区间明细报表
  9: ``, // 收银清单
  report_transfer_details_by_date: `report/comprehensive/report_transfer_details_by_date/`, // 前台转账记录
  biz_date_daily_interval_report: `report/comprehensive/biz_date_daily_interval_report/`, // *营业日报（区间）表
  biz_date_daily_report: `report/comprehensive/biz_date_daily_report/`, // 营业日报表
  report_current_in_live_master_guest_list: `report/comprehensive/report_current_in_live_master_guest_list/`, // 当前在住
  report_today_arrival_reserve_base_list: `report/comprehensive/report_today_arrival_reserve_base_list/` // 本日将到
}

module.exports = {
  reportApi
}
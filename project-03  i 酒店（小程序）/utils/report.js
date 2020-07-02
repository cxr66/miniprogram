
export function getReportApi(inx, data, params) {
  const url = {
    0: `report/comprehensive/report_arrange_detail_list/`, // 冲调账报表
    1: `report/comprehensive/report_ar_charge_summary_by_date/`, // *AR入账简表
    2: `report/comprehensive/report_ar_account_real_time/`, // *AR账户实时余额表
    3: ``, // AR账户收款汇总表
    4: `report/comprehensive/report_ar_account_pay_details/`, // *AR付款明细
    5: `report/comprehensive/report_ar_pay_summary_by_date/`, // *AR收款简表
    6: `report/comprehensive/report_ar_account_charge_details/`, // *AR入账明细报表
    7: ``, // 催账报表
    8: ``, // 结账区间明细报表
    9: ``, // 收银清单
    10: `report/comprehensive/report_transfer_details_by_date/`, // 前台转账记录
    11: `report/comprehensive/biz_date_daily_interval_report/`, // *营业日报（区间）表
    12: `report/comprehensive/biz_date_daily_report/`, // 营业日报表
    25: `report/comprehensive/report_current_in_live_master_guest_list/`, // 当前在住
    61: `report/comprehensive/report_today_arrival_reserve_base_list/` // 本日将到
  }
  return  url[inx]
}
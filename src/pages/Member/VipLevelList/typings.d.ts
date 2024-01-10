declare namespace API {
  type List = {
    code: number;
    data: {
      list: Item[];
      pagination: Partial<PageParams>;
    };
    success: boolean;
    msg: string;
  };

  type Item = {
    id?: number;
    name: string; // 产品名称
    description?: string | null; // 产品描述
    img: string; // 产品图片
    order_amount_min: number; // 最小订单金额
    upgrade_reward: number; // 升级奖励
    task_total: number; // 任务总数
    order_count: number; // 订单总数
    price_min: number; // 最小单价
    price_max: number; // 最大单价
    return_rate: number; // 返现比例
    continue_rate: number; // 连单佣金比例
    withdraw_min: number; // 最小提现金额
    withdraw_max: number; // 最大提现金额
    withdraw_count: number; // 单日提现次数
    withdraw_order_count: number; // 提现订单数
    withdraw_fee: number; // 提现手续费
    status?: number; // 状态
  };

  type AddData = {
    name: string;
    img: string;
    description?: string | null; // 产品描述
    img: string; // 产品图片
    order_amount_min: number; // 最小订单金额
    upgrade_reward: number; // 升级奖励
    task_total: number; // 任务总数
    order_count: number; // 订单总数
    price_min: number; // 最小单价
    price_max: number; // 最大单价
    return_rate: number; // 返现比例
    continue_rate: number; // 连单佣金比例
    withdraw_min: number; // 最小提现金额
    withdraw_max: number; // 最大提现金额
    withdraw_count: number; // 单日提现次数
    withdraw_order_count: number; // 提现订单数
    withdraw_fee: number; // 提现手续费
  };
  type Result = {
    code: number;
    data: Register;
    success: boolean;
    msg: string;
  };
}

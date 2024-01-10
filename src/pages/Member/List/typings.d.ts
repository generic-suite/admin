declare namespace API {
  type List = {
    code: number;
    data: {
      list: UserItem[];
      pagination: Partial<PageParams>;
    };
    success: boolean;
    msg: string;
  };

  type UserItem = {
    id: number;
    balance: string;
    child_count: number;
    create_time: string;
    credit: number;
    deal_pass: string;
    freeze_money: string;
    invite_code: string;
    is_agent: number;
    is_allow_trade: number;
    is_test: number;
    last_login_time?: string;
    level_id: number;
    mobile: string;
    parent_id?: number;
    recharge_money?: string;
    status: number;
    today_trade_money: string;
    today_trade_order_count: number;
    trade_money: string;
    trade_order_count: number;
    userId: number;
    withdraw_money: string;
  };

  type Register = {
    username: string;
    realname: string;
    password: string;
    repassword: string;
    deal_pass: string;
    mobile?: string;
    invite_code?: string;
  };
  type AddMoney = {
    userId: number;
    amount: number;
    isRecharge: boolean;
  };
  type Result = {
    code: number;
    data: Register;
    success: boolean;
    msg: string;
  };
  type BankInfo = {
    bank_name?: string;
    bank_card?: string;
    bank_account?: string;
    branch_name?: string;
    branch_number?: string;
  };
}

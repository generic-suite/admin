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
    username?: string; // 用户名
    bank_name: string; // 银行名称
    bank_card: string; // 银行卡号
    bank_account: number; // 银行账户名
    branch_name: number; // 分行名称
    branch_number: number; // 分行代码
    remark: number; // 备注
  };

  type Result = {
    code: number;
    data: Register;
    success: boolean;
    msg: string;
  };
}

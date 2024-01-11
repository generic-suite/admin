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
    amount: string; // 提现金额
    fee?: string; // 手续费
    status: number; // 状态
    bank_name: string; // 银行名称
    bank_card: string; // 银行卡号
    bank_account: string; // 银行账户名
    branch_name: string; // 分行名称
    branch_number: string; // 分行代码
    audit_info?: string | null; // 审核信息
    audit_user?: string; // 审核人
    audit_time?: string; // 审核时间
    created_at?: string; // 创建时间
  };

  type UpdateCommit = {
    id: number;
    status: number;
    audit_info?: string | null;
  };
}

declare namespace API {
  type List = {
    code: number;
    data: Item[];
    success: boolean;
    msg: string;
  };

  type Item = {
    id?: number;
    name?: string; // 名字
    value: string; // 客服地址
  };

  type UpdateCommit = {
    id: number;
    name: string;
    value: string;
  };
}

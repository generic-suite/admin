declare namespace API {
  type List = {
    code: number;
    data: {
      list: ListItem[];
      pagination: Partial<PageParams>;
    };
    success: boolean;
    msg: string;
  };

  type ListItem = {
    id: number;
    img?: string;
    name: string;
    desc: string;
    create_time: string;
  };
}

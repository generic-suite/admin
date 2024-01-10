declare namespace API {
  type ProductList = {
    code: number;
    data: {
      list: ProductListItem[];
      pagination: Partial<PageParams>;
    };
    success: boolean;
    msg: string;
  };

  type ProductListItem = {
    id: number;
    good_name: string;
    good_img?: string;
    price: number;
  };
}

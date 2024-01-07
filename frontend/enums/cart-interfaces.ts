// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

export interface CartProductDetail {
  productdetailid: number;
  sizeid: number;
  colourid: number;
  qty: number;
  productstatus: string;
  size: string;
  colour: string;
  selected?: boolean;
  cartqty?: number;
}

export interface CartData {
  productid: number;
  productname: string;
  unitprice: string;
  categoryid: number;
  detail: CartProductDetail[];
  url: string;
}

export type CartDataFetch =
  | {
      data: CartData[] | [];
      error: null;
    }
  | {
      data: null;
      error: string;
    };

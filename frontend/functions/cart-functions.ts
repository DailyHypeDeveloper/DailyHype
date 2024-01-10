// Name: Zay Yar Tun
// Admin No: 2235035
// Class: DIT/FT/2B/02

import { CartDataFetch } from "@/enums/cart-interfaces";
import { CartDataLocalStorage } from "@/enums/global-interfaces";

/**
 * get cart data from backend
 * @param isAuthenticated whether the user is authenticated (boolean)
 * @returns Promise(object) - {data, error}
 * @returns data - Array of objects [{productid, productname, unitprice, categoryid, detail, url}]
 * @returns error - string
 * @example
 * getCartData(true).then((result) => {
 *      if(result.data) {
 *          result.data.forEach((item) => {
 *              // implement your data logic here
 *          })
 *      }
 *      else {
 *          // implement your error logic here
 *      }
 * })
 */
export async function getCartData(isAuthenticated: boolean, data: null | CartDataLocalStorage): Promise<CartDataFetch> {
  if (isAuthenticated) {
    return fetch(`${process.env.BACKEND_URL}/api/cart`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          return { data: null, error: result.error } as CartDataFetch;
        } else {
          return { data: result.data, error: null } as CartDataFetch;
        }
      })
      .catch((error) => ({ data: null, error } as CartDataFetch));
  } else {
    return fetch(`${process.env.BACKEND_URL}/api/cartProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: data }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          return { data: null, error: result.error } as CartDataFetch;
        } else {
          return { data: result.data, error: null } as CartDataFetch;
        }
      })
      .catch((error) => ({ data: null, error } as CartDataFetch));
  }
}

/**
 * remove duplicate productdetailid in cart array
 * @param arr cart array ([])
 * @returns array without duplicate data ([])
 * @example
 */
export function removeDuplicateCartData(arr: CartDataLocalStorage[]) {
  if (arr && arr.length > 0) {
    let tempArr: CartDataLocalStorage[] = [];
    arr.forEach((item) => {
      let condition = true;
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].productdetailid === item.productdetailid) {
          condition = false;
          tempArr[i].qty += item.qty;
          break;
        }
      }
      if (condition) {
        tempArr.push(item);
      }
      console.log(tempArr);
    });
    return tempArr;
  } else {
    return [];
  }
}

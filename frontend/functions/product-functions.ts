interface LatestProduct {}


// Name: Zay Yar Tun

/**
 *
 * @param limit a number for the number of latest products (must be greater than 0)
 * @returns Promise
 * @example
 * getLatestProducts(4)
 * .then((data) => {
 *      console.log(data);      // this is latest product data
 * })
 */
export async function getLatestProducts(limit: number) {
  if (limit > 0) {
    return fetch(`${process.env.BACKEND_URL}/api/latestproduct/${limit}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        return data.product;
      });
  } else {
    return new Promise((resolve) => {
      resolve([]);
    });
  }
}

// Name: Zay Yar Tun
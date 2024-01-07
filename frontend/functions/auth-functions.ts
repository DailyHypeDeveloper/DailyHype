import { ErrorMessage } from "@/enums/global-enums";

/**
 *
 * to validate token
 * This will return true if the token is validated, otherwise false
 * @param role user role must be either customer or admin
 * @returns Promise
 * @example
 * validateToken("customer")
 * .then((result) => {
 *      if(result)    // is customer
 *      else          // is not customer
 * })
 */
export async function validateToken(role: "customer" | "admin", userid: number): Promise<boolean> {
  return fetch(`${process.env.BACKEND_URL}/api/validateToken/${userid}`, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 403) {
        return false;
      } else {
        return response.json();
      }
    })
    .then((result) => {
      if (result.role === role) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

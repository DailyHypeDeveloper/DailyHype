/**
 *
 * to validate user token, for admin, use another function called validateAdminToken
 * This will return true if the user token is validated, otherwise false
 * @param token (string)
 * @returns Promise (boolean)
 */
export async function validateUserToken(): Promise<boolean> {
  return fetch(`${process.env.BACKEND_URL}/api/validateToken`, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 403) {
        return false;
      } else {
        return true;
      }
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

/**
 *
 * to validate admin token, for user, use another function called validateUserToken
 * This will return true if the admin token is validated, otherwise false
 * @param token (string)
 * @returns Promise (boolean)
 */
export async function validateAdminToken(): Promise<boolean> {
  return fetch(`${process.env.BACKEND_URL}/api/validateAdminToken`, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      if (response.status === 403) {
        return false;
      } else {
        return true;
      }
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}

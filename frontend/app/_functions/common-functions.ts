/**
 *
 * This will return true if the token is validated, otherwise false
 * @param token (string)
 * @returns Promise (boolean)
 */
export async function validateToken(token: string): Promise<boolean> {
  return fetch(`${process.env.BACKEND_URL}/api/validateToken`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
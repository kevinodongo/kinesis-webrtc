/**
 * handle error on signal connection
 */
export function handleError(err?: any) {
  throw new Error(`Ops! something went wrong in your channel ${err}`);
}

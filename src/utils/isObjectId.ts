export function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

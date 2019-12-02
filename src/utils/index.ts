export function createUrlQuery(data: any) {
  return Object.keys(data)
    .map((key, i) =>
      Array.isArray(data[key]) ? data[key].map((v: string) => `${key}=${v}`).join("&") : `${key}=${data[key]}`,
    )
    .join("&");
}

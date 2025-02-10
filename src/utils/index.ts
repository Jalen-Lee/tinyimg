export const validTinifyExts = ['png', 'jpg', 'jpeg', 'webp']

export function isAvailableTinifyExt(ext: string) {
  return validTinifyExts.includes(ext);
}

export function isAvailableImageExt(ext: string) {
  return isAvailableTinifyExt(ext)
}

export function isValidArray(arr: unknown){
  return Array.isArray(arr) && arr.length > 0;
}
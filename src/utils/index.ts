export const validTinifyExts = ['png', 'jpg', 'jpeg', 'webp']

export function isAvailableTinifyExt(ext: string) {
  return validTinifyExts.includes(ext);
}

export function isAvailableImageExt(ext: string) {
  return isAvailableTinifyExt(ext)
}
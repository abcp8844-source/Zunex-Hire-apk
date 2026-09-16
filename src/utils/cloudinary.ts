export const getOptimizedImageUrl = (
  url?: string | null,
  width: number = 800
): string | null => {
  if (!url) return null;

  if (url.includes('cloudinary.com')) {
    const transformation = `f_auto,q_auto,c_limit,w_${width}`;
    return url.replace(/\/upload\/(?:v\d+\/)?/, `/upload/${transformation}/`);
  }

  return url;
};

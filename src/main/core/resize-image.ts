import sharp from 'sharp';

const resizeImage = async (imagePath: string): Promise<Buffer> => {
  return sharp(imagePath)
    .resize(1280, 720, { fit: 'cover' })
    .png()
    .toBuffer();
};

export { resizeImage };


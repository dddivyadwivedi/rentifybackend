require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_BUCKET = process.env.S3_BUCKET;
const REGION = process.env.REGION;


export const uploadToS3 = async (file, storePath) => {
    try {
      const client = new S3Client({
        region: REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      });
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        ACL: 'public-read',
        Key: `${storePath}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      let data = await client.send(command);
      let uploadedImageLink = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${storePath}/${file.originalname}`;
      return uploadedImageLink;
    } catch (err) {
      console.log(err.message);
      throw new Error('Error while uploading file into s3');
    }
  };
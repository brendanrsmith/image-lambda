'use strict';

require('dotenv').config();

const { S3 } = require ('@aws-sdk/client-s3');
const client = new S3({ region: 'us-west-2', aws_access_key_id: process.env.AWS_ID, aws_secret_access_key: process.env.AWS_SECRET })

exports.handler = async (event, context, callback) => {

  let pics = [];
  const bucket = event.Records[0].s3.bucket.name;

  console.log('EVENT DETAILS!', JSON.stringify(event, undefined, 2));

  try {

    // list all objects in brs-lab-17 bucket
    const data = await client.listObjectsV2({ Bucket: bucket });

    // map those contents to pics array
    pics = data.Contents.map((element) => {
      return {
        name: element.Key,
        size: element.Size,
        lastModified: element.LastModified
      }
    })
    console.log('pics!', pics);
    const picJSON = JSON.stringify(pics, null, 2);
    // TODO: get images.json file from bucket
    const imagesJson = await client.getObject({ Bucket: bucket, Key: 'images.json' });
    console.log('imagesJSON', imagesJson);

    // TODO: re-write images.json file with new pics array 
    const params = {
      Bucket: bucket,
      Key: 'images.json',
      Body: picJSON
    }
    // TODO: upload new images.json file back to S3
    const updateJson = await client.putObject(params);
    console.log('updatedJSON', updateJson);

  } catch (error) {
    console.log(error);
    return "there was an error connnecting to S3";
  }
}

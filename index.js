'use strict';


const { S3 } = require ('@aws-sdk/client-s3');
const client = new S3({ region: 'us-west-2', aws_access_key_id: 'AKIAQWD5F3LGKMR4QWWI', aws_secret_access_key: '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' })

exports.handler = async (event, context, callback) => {

  let pics = [];

  console.log('EVENT DETAILS!', JSON.stringify(event, undefined, 2));

  try {

    // list all objects in brs-lab-17 bucket
    const data = await client.listObjectsV2({ Bucket: 'brs-lab-17' });

    // map those contents to pics array
    pics = data.Contents.map((element) => {
      return {
        name: element.Key,
        size: element.Size,
        lastModified: element.LastModified
      }
    })
    console.log('pics!', pics);

    // TODO: get images.json file from bucket
    const imagesJson = await client.getObject({ Bucket: 'arn:aws:s3:us-west-2:047507167948:accesspoint/imagejson', Key: 'images.json' });
    console.log('imagesJSON', imagesJson);

    // TODO: re-write images.json file with new pics array 

    // TODO: upload new images.json file back to S3

  } catch (error) {
    console.log(error);
    return "there was an error connnecting to S3";
  }
}

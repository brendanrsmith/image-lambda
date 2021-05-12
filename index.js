'use strict';

const { GetObjectCommand, S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const client = new S3Client({ region: 'us-west-2'})
const command = new ListObjectsV2Command({Bucket: 'brs-lab-17'});
const getObject = new GetObjectCommand({Bucket: 'arn:aws:s3:us-west-2:047507167948:accesspoint/imagejson', Key: 'images.json'});

exports.handler = async (event, context, callback) => {

  let pics = [];

  console.log('EVENT DETAILS!', JSON.stringify(event, undefined, 2));

  try {
    // list all objects in brs-lab-17 bucket
    const data = await client.send(command);
    // console.log('DATA FROM S3', data.Contents);
    
    // add those contents to pics array
    const contents = data.Contents;
    contents.forEach(element => {
      pics.push({
        name: element.Key,
        size: element.Size,
        lastModified: element.LastModified
      })
    });
    console.log('pics!', pics);
    // get images.json file from bucket
    const imagesJson = await client.send(getObject);
    console.log('imagesJSON', imagesJson);

    // TODO: re-write images.json file with new pics array 

    // TODO: upload new images.json file back to S3

  } catch (error) {
    console.log(error);
    return "there was an error connnecting to S3";
  }
}

// data: 
  // Contents: [
  //   {
  //     Key: 'Screen Shot 2021-05-11 at 1.59.35 PM.png',
  //     LastModified: 2021-05-11T21:11:34.000Z,
  //     ETag: '"0c5a3f79e6722cec93a225cf77df9d91"',
  //     Size: 321248,
  //     StorageClass: 'STANDARD',
  //     Owner: undefined
  //   },

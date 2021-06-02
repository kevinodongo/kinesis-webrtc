# Kinesis WebRTC


[![NPM version](https://img.shields.io/npm/v/kinesis-webrtc.svg?style=flat-square)](https://www.npmjs.com/package/kinesis-video-webrtc)
[![NPM version](https://img.shields.io/npm/l/kinesis-webrtc?style=flat-square)](https://www.npmjs.com/package/kinesis-video-webrtc)


This package is used to interract with Amazon Kinesis Video Streams WebRTC SDK for JavaScript. The package allows you to intergrate Video and Audio capabilities to your application.

## Installation
To install this package, simply type add or install kinesis-webrtc using your favorite package manager:

```bash
npm i kinesis-webrtc
OR
yarn add kinesis-webrtc
```

The package is modulized by simple commands. To send a request, you only need to import the `KinesisClient` and interact with `Amazon Kinesis Video Streams WebRTC SDK`.

```bash
// commonJs
const { KinesisClient } = require("kinesis-webrtc")
```

```bash
// es6+
import { KinesisClient } from "kinesis-webrtc"
```

We have provided roles for MASTER and VIEWER. These can be accessed by importing the `Role` from kinesis-webrtc.

```bash
// import roles
import { Role } from "kinesis-webrtc"

// usage

Role.MASTER 

OR

Role.VIEWER
```

## Getting started
You can start by trying out the SDK with a webcam on the example [Kinesis Video Stream Example](https://kinesis-video-webrtc-example.netlify.app/).

It is also recommended to develop familiarity with the WebRTC protocols and KVS Signaling Channel APIs. [AWS Documentation](https://docs.aws.amazon.com/kinesisvideostreams-webrtc-dg/latest/devguide/what-is-kvswebrtc.html)



## Usage
This section demostrates how to use this package to interract with `Amazon Kinesis Video Streams WebRTC SDK`. Refer to the examples directory for an example of a complete application.

#### Import and initialize KinesisClient from `kinesis-video-webrtc`

```bash
// import and initialize the KinesisClient

import { KinesisClient } from "kinesis-webrtc"

const kinesisClient = new KinesisClient({
  region: process.env.Region /*requried*/,
  accessKeyId: process.env.AcessKeyId /*requried*/,
  secretAccessKey: process.env.SecretAccessKey /*requried*/,
})
```
See Managing Credentials for more information about managing credentials in a web environment.

#### Initialize your WebCam and Audio

We have provided a command that will allow you to prompt users to accept access of camera and audio usage. There are two commands that can be used to during initialization of WebCam and Audio.

The `getMedia()` function once called you only have to listen to `localstream` event and you will be able to access your localStream.

```bash


const localView = document.getElementById('localView')

// listen to the local stream
kinesisClient.on("localstream", (event) => {
  localView.srcObject = event
})


// listen to the remote stream
const remoteView = document.getElementById('remoteView')


kinesisClient.on("remotestream", (event) => {
  remoteView.srcObject = event.streams[0]
})

await kinesisClient.getMedia({
        audio: {
          sampleSize: 8, // OR 16
          echoCancellation: true,
        },
        video: {
          width: {
            min: 640,
            max: 1024,
          },
          height: {
            min: 480,
            max: 768,
          },
        },
      })
```

You are not confined in using `getMedia()` function we have also provided a `setMedia()` function to allow you to initialize your webcam and audio and only send the stream of each user to KinesisClient. This cammand can be used appropriately if deploying the application in Nodejs backend.


```bash
// get your media streams
// local stream
kinesisClient.on("localstream", (event) => {
  ....
})

// remote streams
kinesisClient.on("remotestream", (event) => {
  ....
})


const stream: any = await navigator.mediaDevices
      .getUserMedia(constraints)
      .catch((err) => console.log(error));

// set media streams
await kinesisClient.setMedia(stream)
```

Once we have initialized the media, in the next steps we will separate the commands for viewer and master user to show how easy it is to interract with `kinesis-webrtc`.

### Master

The master role entails the following actions in a normal `Amazon Kinesis Video Streams WebRTC SDK` usage:

Create a Signaling Channel
Generate Endpoints and IceServers
Initialize signalling client 
Connect to signalling client

To capture the above we have reduced the interraction to few commands. We provide `getChannelARN()` which will check if a signalling channel being created is available to reduce duplication error on creation attempt and `setChannelARN()` to create new signlaing channels.

These three commands will complete MASTER connection awaiting viewers to join the channel. Ensure the `session name is unique`.

```bash
/*create a channel incase not available*/
await kinesisClient.setChannelARN(sessionName);

/*provide role*/
await kinesisClient.setKinesisClient({
  role: Role.MASTER,
});

/*connect to channel*/
kinesisClient.masterConnect();
```

To check if channelARN is available run the following command:

```bash
/*get channle arn*/
await kinesisClient.getChannelARN(sessionName);
```

### Viewer
The viewer role entails the following actions in a normal `Amazon Kinesis Video Streams WebRTC SDK` usage:

Generate Endpoints and IceServers
Initialize signalling client 
Connect to signalling client

```bash
/*get channle arn*/
await kinesisClient.getChannelARN(sessionName);

/*provide role and client id*/
await kinesisClient.setKinesisClient({
  role: Role.VIEWER,
  clientId: 12345 /*required*/
});

/*connect to signaling channel*/
kinesisClient.viewerConnect();
```

That is all you have to do to generate a connection between the Master and Viewers. Use the example provided to guide you through the usage of `kinesis-webrtc`.

## Cleanup
For cleanup after each session we have provided a single command to cleanup your AWS enviroment. This function can be called by either the VIEWER or MASTER. Just call `getChannelARN()` command and `deleteChannel()` command. 

```bash
/*gets the signal channel arn*/
await kinesisClient.getChannelARN(sessionName);

/*deletes the signaling channel*/
await kinesisClient.deleteChannel()

OR

// provide the channel ARN to deleteChannel function
await kinesisClient.deleteChannel('arn:aws:kinesisvideo:us-west-2:123456789012:channel/testChannel/1234567890') 
```

## Other Events

We have provided other events that you can connect to and listen to users connecting and disconnecting in the channel. 

```bash
// listen to all connection
kinesisClient.on("connected", (event) => {
  ....
})

// listen to all disconnection
kinesisClient.on("disconnected", (event) => {
  ....
})
```


## Development
Running kinesis-video-webrtc example locally
The example can be edited and run locally by following these instructions:

NodeJS version 8+ is required.

```bash
Run npm install to download dependencies.
Run npm run develop to run the webserver.
Open the WebRTC test page at http://localhost:1234
You will need to provide an AWS region, AWS credentials, and a Channel Name.
```
The source code for the test page is in the [examples directory](https://github.com/kevinodongo/kinesis-webrtc/tree/main/example).

## Notice
This project is licensed under the MIT License. see [LICENSE](https://github.com/kevinodongo/kinesis-webrtc/blob/main/LICENSE) for more information.


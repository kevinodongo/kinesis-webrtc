# Kinesis Video WebRTC

This package is used to interract with Amazon Kinesis Video Streams WebRTC SDK for JavaScript. The package allows you to intergrate Video and Audio capabilities to your application.

## Installation
To install this package, simply type add or install kinesis-video-webrtc using your favorite package manager:

```bash
npm i kinesis-video-webrtc
OR
yarn add kinesis-video-webrtc
```

The package is modulized by simple commands. To send a request, you only need to import the `KinesisClient` and interact with `Amazon Kinesis Video Streams WebRTC SDK`.

```bash
// commonJs
const { KinesisClient } = require("kinesis-video-webrtc")
```

```bash
// es6+
import { KinesisClient } from "kinesis-video-webrtc"
```

We have provided roles for MASTER and VIEWER. These can be accessed by importing the `Role` from kinesis-video-client.

```bash
import { Role } from "kinesis-video-webrtc"
```

## Getting started
You can start by trying out the SDK with a webcam on the example [Kinesis Video Stream Example](https://kinesis-video-webrtc-example.netlify.app/).

It is also recommended to develop familiarity with the WebRTC protocols and KVS Signaling Channel APIs. [AWS Documentation](https://docs.aws.amazon.com/kinesisvideostreams-webrtc-dg/latest/devguide/what-is-kvswebrtc.html)



## Usage
This section demostrates how to use this package to interract with `Amazon Kinesis Video Streams WebRTC SDK`. Refer to the examples directory for an example of a complete application.

#### Import and initialize KinesisClient from `kinesis-video-webrtc`

```bash
// import and initialize the KinesisClient

import { KinesisClient } from "kinesis-video-webrtc"

const kinesisClient = new KinesisClient({
  region: process.env.Region /*requried*/,
  accessKeyId: process.env.AcessKeyId /*requried*/,
  secretAccessKey: process.env.SecretAccessKey /*requried*/,
})
```
See Managing Credentials for more information about managing credentials in a web environment.

#### Initialize your WebCam and Audio

We have provided a command that will allow you to prompt users to accept camera and audio usage. We recommend using await operator to wait for the promise returned by send operation as follows:

```bash
// To get the localstreams and remotestreams call this command and supply the following video and auido constraints
// The localstream is a single stream for the current user.
// Remotestream is an array of all media excluding the current user. Just add a boolean true after your constraints and the current user will be included in the remotestreams.
// This gives you a room to either render the remotestreams with all users or split.

const localView = document.getElementById('localView')
const stream = await kinesisClient.getMedia({
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
      },
      true)
localView.srcObject = stream
```

You are not confined in using `getMedia()` function we have also provided a `setMedia()` function to allow you to initialize your webcam and audio and only send the stream of each user to KinesisClient. This cammand can be used appropriately if deploying the application in Nodejs backend.


```bash
// get your media streams

const stream: any = await navigator.mediaDevices
      .getUserMedia(constraints)
      .catch((err) => console.log(error));

// set media streams
await kinesisClient.setMedia(stream, true)
```

Once we have initialized the media, in the next steps we will separate the commands for viewer and master user to show how easy it is to interract with `kinesis-video-webrtc`.

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

That is all you have to do to generate a connection between the Master and Viewers. Use the example provided to guide you through the usage of `kinesis-video-webrtc`.

## Cleanup
For cleanup after each session we have provided a single command to cleanup your AWS enviroment. This function can be called by either the VIEWER or MASTER. Just call `getChannelARN()` command and `deleteChannel()` command. 

```bash
/*gets the signal channel arn*/
await kinesisClient.getChannelARN(sessionName);

/*deletes the signaling channel*/
await kinesisClient.deleteChannel()
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


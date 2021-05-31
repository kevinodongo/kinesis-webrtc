import * as React from "react";
import "./index.css";
import Loader from "./Loader";
import Local from "./Local";
import Remote from "./Remote";
import Alert from "./Alert";
import { v4 as uuidv4 } from "uuid";

// import package
import { KinesisClient, Role } from "../.";
//import { KinesisClient, Role } from "kinesis-video-webrtc";
import { decryptValue } from "./helpers";

function Session() {
  // state
  const [isLoading, setisLoading] = React.useState<boolean>(true);
  const [alert, setAlert] = React.useState<boolean>(true);
  const [remoteStreams, setRemoteStreams] = React.useState<any[]>([1]);
  const [localStream, setLocalStream] = React.useState<string>("");
  const [videoLabel, setVideoLabel] = React.useState<string>("");
  const [audionLabel, setAudioLabel] = React.useState<string>("");
  const decryptedResponse = decryptValue(
    window.location.pathname.split("/")[1]
  );
  const kinesisClient = new KinesisClient({
    region: decryptedResponse.region /*requried*/,
    accessKeyId: decryptedResponse.accessKeyId /*requried*/,
    secretAccessKey: decryptedResponse.secretAccessKey /*requried*/,
  });

  // side effects
  React.useEffect(() => {
    let mounted = true;
    function checkRole() {
      const role = sessionStorage.getItem("@role");
      if (role === "master") {
        initializeMaster();
      } else {
        initializeViewer();
      }
    }
    if (mounted) checkRole();
    return () => {
      mounted = false;
    };
  }, []);

  // initialize master
  async function initializeMaster() {
    /**
     * get media stream
     * - This will prompt user to open camera and audio
     * - provide constraints
     * OR
     * set media stream
     * - generate local stream and send to kinesis client
     */
    await kinesisClient.getMedia(
      {
        audio: {
          sampleSize: 8,
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
      true
    );
    setisLoading(false);
    /*get local stream and remote streams*/
    setLocalStream(kinesisClient.localStream);
    setRemoteStreams(kinesisClient.remoteStreams);
    /*get video and audio label*/
    setVideoLabel(
      kinesisClient.localStream.getVideoTracks()[0].label
    ); /*optional*/
    setAudioLabel(
      kinesisClient.localStream.getAudioTracks()[0].label
    ); /*optional*/
    /*get channle arn*/
    await kinesisClient.getChannelARN(decryptedResponse.sessionName);
    /*create a channel incase not available*/
    await kinesisClient.setChannelARN(decryptedResponse.sessionName);
    /*provide role*/
    await kinesisClient.setKinesisClient({
      role: Role.MASTER,
    });
    kinesisClient.masterConnect();
  }

  // initialize viewer
  async function initializeViewer() {
    /**
     * get media stream
     * - This will prompt user to open camera and audio
     * - provide constraints
     * OR
     * set media stream
     * - generate local stream and send to kinesis client
     */
    await kinesisClient.getMedia(
      {
        audio: {
          sampleSize: 8,
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
      true
    );
    setisLoading(false);
    /*get local stream and remote streams*/
    setLocalStream(kinesisClient.localStream);
    setRemoteStreams(kinesisClient.remoteStreams);
    /*get video and audio label*/
    setVideoLabel(
      kinesisClient.localStream.getVideoTracks()[0].label
    ); /*optional*/
    setAudioLabel(
      kinesisClient.localStream.getAudioTracks()[0].label
    ); /*optional*/
    /*get channle arn*/
    await kinesisClient.getChannelARN(decryptedResponse.sessionName);
    /*provide role and client id*/
    await kinesisClient.setKinesisClient({
      role: Role.VIEWER,
      clientId: uuidv4(),
    });
    kinesisClient.viewerConnect();
  }

  // remove channel
  async function removeChannel() {
    await kinesisClient.getChannelARN(decryptedResponse.sessionName);
    await kinesisClient.deleteChannel();
  }

  // close alert
  function closeAlert() {
    setAlert(false);
  }

  if (isLoading) return <Loader />;
  return (
    <div id="sessionContent">
      {/**/}
      <div className="sessionLabel">
        <div style={{ color: "#D1D5DB", fontSize: "13px" }}>
          Camera: {videoLabel}
        </div>
        <div style={{ color: "#D1D5DB", fontSize: "13px" }}>
          Audio: {audionLabel}
        </div>
      </div>
      {/*remote*/}
      <div id="remoteSession">
        <Remote remoteStreams={remoteStreams} />
      </div>

      {/*local*/}
      <div id="localSession">
        <Local localStream={localStream} removeChannel={removeChannel} />
      </div>

      {/*
              - Session url alert
              - Inline css
            */}
      {alert && (
        <div className="sessionAlert">
          <Alert closeAlert={closeAlert} />
        </div>
      )}
    </div>
  );
}

export default Session;

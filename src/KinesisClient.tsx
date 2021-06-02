/* eslint-disable prettier/prettier */
import { EventEmitter } from "events";
import KinesisVideo from "aws-sdk/clients/kinesisvideo";
import KinesisVideoSignalingChannels from "aws-sdk/clients/kinesisvideosignalingchannels";
import { SignalingClient, Role } from "amazon-kinesis-video-streams-webrtc";
import { validateValueHasProperty } from "./helpers/validate";
import { handleError } from "./helpers/handleError";

interface KinesisConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

interface KinesisValue {
  role: any;
  clientId?: string;
}


export class KinesisClient extends EventEmitter {
  private readonly awsConfig: KinesisConfig;
  private readonly kinesisVideoClient: any;
  private localStream: any = "";
  private signalingClient: any = null;
  private iceServers: any[] = [];
  private peerConnectionByClientId: any[] = [];
  private peerConnection: any = "";
  private channelARN: any = "";

  constructor(value: KinesisConfig) {
    super()

    // validate region | access key id | secret access key
    validateValueHasProperty(value.region, "Region");
    validateValueHasProperty(value.accessKeyId, "Access key id");
    validateValueHasProperty(value.secretAccessKey, "Secret access key");
    // set config
    this.awsConfig = { ...value };
    // set a new kinesis video client
    this.kinesisVideoClient = new KinesisVideo(value);
  }

  /**
   * open media
   * @returns stream
   */
  public async getMedia(constraints: any) {
    const stream: any = await navigator.mediaDevices
      .getUserMedia(constraints)
      .catch((err) => handleError(err));
    this.localStream = stream;
    if (this.localStream) this.emit('localstream', this.localStream)
  }

  /**
 * set media
 * @param media
 */
  public setMedia(stream: any) {
    validateValueHasProperty(stream, "Local stream");
    this.localStream = stream;
  }

  /**
   * Describe channel
   * @param channelName
   * @returns channelARN
   */
  public async getChannelARN(name: string) {
    validateValueHasProperty(name, "Channel Name");
    try {
      const describeChannel = await this.kinesisVideoClient
        .describeSignalingChannel({
          ChannelName: name,
        })
        .promise();
      this.channelARN = describeChannel.ChannelInfo.ChannelARN;
    } catch (error) {
      return;
    }
  }

  /**
   * Create a channel
   * @param channelName
   * @returns channelARN
   */
  public async setChannelARN(name: string) {
    validateValueHasProperty(name, "Channel Name");
    if (!this.channelARN) {
      const createChannel = await this.kinesisVideoClient
        .createSignalingChannel({
          ChannelName: name,
          ChannelType: "SINGLE_MASTER",
        })
        .promise();
      this.channelARN = createChannel.ChannelARN;
    }
  }

  /**
   * Generate ice candidates
   * @param value { role, clientId }
   * @returns ice servers
   */
  public async setKinesisClient(value: KinesisValue) {
    // generate endpoints
    validateValueHasProperty(value.role, "Kinesis Role");
    let endpointConfiguration: any = {};
    if (value.role === "MASTER") {
      endpointConfiguration = {
        ChannelARN: this.channelARN,
        SingleMasterChannelEndpointConfiguration: {
          Protocols: ["WSS", "HTTPS"],
          Role: Role.MASTER,
        },
      };
    } else {
      endpointConfiguration = {
        ChannelARN: this.channelARN,
        SingleMasterChannelEndpointConfiguration: {
          Protocols: ["WSS", "HTTPS"],
          Role: Role.VIEWER,
        },
      };
    }
    const getChannelEndpoint: any = await this.kinesisVideoClient
      .getSignalingChannelEndpoint(endpointConfiguration)
      .promise();
    const endpointsByProtocol: any =
      getChannelEndpoint.ResourceEndpointList.reduce(
        (endpoints: any, endpoint: any) => {
          endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
          return endpoints;
        },
        {}
      );
    const kinesisChannelsClient = new KinesisVideoSignalingChannels({
      region: this.awsConfig.region,
      accessKeyId: this.awsConfig.accessKeyId,
      secretAccessKey: this.awsConfig.secretAccessKey,
      endpoint: endpointsByProtocol.HTTPS,
      correctClockSkew: true,
    });
    const getIceServer: any = await kinesisChannelsClient
      .getIceServerConfig({
        ChannelARN: this.channelARN,
      })
      .promise();
    const iceServers = [];
    // use either
    iceServers.push({
      urls: `stun:stun.kinesisvideo.${this.awsConfig.region}.amazonaws.com:443`,
    });
    // OR
    getIceServer.IceServerList.forEach((iceServer: any) =>
      iceServers.push({
        urls: iceServer.Uris,
        username: iceServer.Username,
        credential: iceServer.Password,
      })
    );
    this.iceServers = iceServers;

    let signalingClientConfiguration: any = {};
    if (value.role === "MASTER") {
      signalingClientConfiguration = {
        channelARN: this.channelARN,
        channelEndpoint: endpointsByProtocol.WSS,
        role: Role.MASTER,
        region: this.awsConfig.region,
        credentials: {
          accessKeyId: this.awsConfig.accessKeyId,
          secretAccessKey: this.awsConfig.secretAccessKey,
        },
        systemClockOffset: this.kinesisVideoClient.config.systemClockOffset,
      };
    } else {
      signalingClientConfiguration = {
        channelARN: this.channelARN,
        channelEndpoint: endpointsByProtocol.WSS,
        clientId: value.clientId,
        role: Role.VIEWER,
        region: this.awsConfig.region,
        credentials: {
          accessKeyId: this.awsConfig.accessKeyId,
          secretAccessKey: this.awsConfig.secretAccessKey,
        },
        systemClockOffset: this.kinesisVideoClient.config.systemClockOffset,
      };
    }
    this.signalingClient = new SignalingClient(signalingClientConfiguration);
  }

  /**
   * Delete channel
   */
  public async deleteChannel(event?: any) {
    if (event) {
      validateValueHasProperty(event, "Channel ARN")
    }
    await this.kinesisVideoClient
      .deleteSignalingChannel({
        ChannelARN: this.channelARN ? this.channelARN : event,
      })
      .promise();
    this.localStream = "";
  }

  /**
 * Master connect to channel
 * - create an answer
 * - handle offer and ice candidates
 * - send answer and ice candidates
 * - handle disconnection
 */
  public async masterConnect() {
    this.signalingClient.on("open", async () => {
      this.emit("connected")
    });
    this.signalingClient.on(
      "sdpOffer",
      async (offer: any, remoteClientId: any) => {
        const configuration = {
          iceServers: this.iceServers,
        };
        // Create a new peer connection using the offer from the given client
        this.peerConnection = new RTCPeerConnection(configuration);
        this.peerConnectionByClientId[remoteClientId] = this.peerConnection;
        // Send any ICE candidates to the other peer
        this.peerConnection.addEventListener(
          "icecandidate",
          ({ candidate }: any) => {
            if (candidate) {
              const canTrickle = this.peerConnection.canTrickleIceCandidates;
              if (canTrickle) {
                this.signalingClient.sendIceCandidate(
                  candidate,
                  remoteClientId
                );
              } else {
                this.signalingClient.sendSdpAnswer(
                  this.peerConnection.localDescription,
                  remoteClientId
                );
              }
            }
          }
        );
        // As remote tracks are received, add them to the remote view
        this.peerConnection.addEventListener("track", (event: any) => {
          this.emit('remotestream', event)
        });
        // If there's no video/audio, KinesisUser.localStream will be null. So, we should skip adding the tracks from it.
        if (this.localStream !== null) {
          this.localStream
            .getTracks()
            .forEach((track: any) =>
              this.peerConnection.addTrack(track, this.localStream)
            );
        }
        await this.peerConnection.setRemoteDescription(offer);
        // Create an SDP answer to send back to the client
        await this.peerConnection.setLocalDescription(
          await this.peerConnection.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          })
        );
        const canTrickle = this.peerConnection.canTrickleIceCandidates;
        if (canTrickle) {
          this.signalingClient.sendSdpAnswer(
            this.peerConnection.localDescription,
            remoteClientId
          );
        }
      }
    );
    this.signalingClient.on(
      "iceCandidate",
      async (candidate: any, remoteClientId: any) => {
        this.peerConnection = this.peerConnectionByClientId[remoteClientId];
        this.peerConnection.addIceCandidate(candidate);
      }
    );
    this.signalingClient.on("close", () => {
      this.emit("disconnected")
    });
    this.signalingClient.on("error", () => {
      handleError();
    });
    this.signalingClient.open();
  }

  /**
   * Viewer connect to channel
   * - create an offer
   * - send offer and ice candidates
   * - handle answer and ice candidates
   * - handle disconnection
   */
  public async viewerConnect() {
    const configuration = {
      iceServers: this.iceServers,
    };
    this.peerConnection = new RTCPeerConnection(configuration);
    this.signalingClient.on("open", async () => {
      this.emit("connected")
      this.localStream
        .getTracks()
        .forEach((track: any) =>
          this.peerConnection.addTrack(track, this.localStream)
        );

      await this.peerConnection.setLocalDescription(
        await this.peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
      );

      const canTrickle = this.peerConnection.canTrickleIceCandidates;
      if (canTrickle) {
        //console.log("[KinesisUser] Sending SDP offer");
        this.signalingClient.sendSdpOffer(this.peerConnection.localDescription);
      }
    });
    this.signalingClient.on("sdpAnswer", async (answer: any) => {
      await this.peerConnection.setRemoteDescription(answer);
    });
    this.signalingClient.on("iceCandidate", (candidate: any) => {
      this.peerConnection.addIceCandidate(candidate);
    });
    this.peerConnection.addEventListener(
      "icecandidate",
      ({ candidate }: any) => {
        const canTrickle = this.peerConnection.canTrickleIceCandidates;
        if (candidate) {
          // When trickle ICE is enabled, send the ICE candidates as they are generated.
          if (canTrickle) {
            //console.log("[KinesisUser] Sending ICE candidate");
            this.signalingClient.sendIceCandidate(candidate);
          }
        } else {
          // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
          if (!canTrickle) {
            //console.log("[KinesisUser] Sending SDP offer");
            this.signalingClient.sendSdpOffer(
              this.peerConnection.localDescription
            );
          }
        }
      }
    );
    this.peerConnection.addEventListener("track", (event: any) => {
      this.emit('remotestream', event)
    });
    this.signalingClient.on("close", () => {
      this.emit("disconnected")
    });
    this.signalingClient.on("error", () => {
      handleError();
    });
    this.signalingClient.open();
  }
}

import * as React from "react";

interface IProps {
  localStream: string;
}

function Local({ localStream }: IProps) {
  const [showVideo, setshowVideo] = React.useState<boolean>(false);
  const [mute, setMute] = React.useState<boolean>(false);

  React.useEffect(() => {
    let mounted = true;
    function mountStream() {
      const localView: any = document.getElementById("localView");
      if (localStream) localView.srcObject = localStream;
    }
    if (mounted) mountStream();
    return () => {
      mounted = false;
    };
  }, [localStream]);

  // delete channel
  async function exitSession() {
    //setLoader()
    // clear viewers stream
    const localViews: any = document.querySelectorAll(".localViews");
    await localViews.forEach(async (localView: any) => {
      const audio__tracks = await localView.srcObject.getTracks();
      await audio__tracks.forEach((track: any) => track.stop());
    });
    // clear local stream
    const localView: any = document.getElementById("localView");
    const video__tracks = await localView.srcObject.getTracks();
    await video__tracks.forEach((track: any) => track.stop());
    // route back to home page
    routeBack();
  }

  // mute main audio
  function mutemainaudio() {
    const localView: any = document.getElementById("localView");
    localView.srcObject
      .getAudioTracks()
      .forEach((track: any) => (track.enabled = !track.enabled));
    setMute(!mute);
  }

  // stop and show video
  function stopandshowvideo() {
    const localView: any = document.getElementById("localView");
    localView.srcObject
      .getVideoTracks()
      .forEach((track: any) => (track.enabled = !track.enabled));
    setshowVideo(!showVideo);
  }

  // route back
  async function routeBack() {
    const hostname = window.location.hostname;
    let path;
    if (hostname === "localhost") {
      path = `${window.location.protocol}//${window.location.hostname}:3000/`;
    } else {
      path = `${window.location.protocol}//${window.location.hostname}/`;
    }
    window.location.assign(`${path}`);
  }

  return (
    <div>
      <div id="localContent">
        <video width="100%" id="localView" autoPlay playsInline></video>
      </div>
      <div id="localButtonSection">
        <button onClick={mutemainaudio} className="localButton">
          {mute ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "white", transform: "-ms-filter" }}
            >
              <path d="M21.707 20.293l-2.023-2.023c1.44-1.686 2.315-3.846 2.315-6.27 0-4.091-2.472-7.453-5.999-9v2c2.387 1.386 3.999 4.047 3.999 7 0 1.832-.629 3.543-1.672 4.913l-1.285-1.285C17.644 14.536 18 13.19 18 12c0-1.771-.775-3.9-2-5v7.586l-2-2V4c0-.369-.203-.708-.528-.882-.324-.174-.72-.154-1.026.05L7.727 6.313l-4.02-4.02L2.293 3.707l18 18L21.707 20.293zM12 5.868v4.718L9.169 7.755 12 5.868zM4 17h2.697l5.748 3.832C12.612 20.943 12.806 21 13 21c.162 0 .324-.039.472-.118C13.797 20.708 14 20.369 14 20v-1.879l-2-2v2.011l-4.445-2.964c-.025-.017-.056-.02-.082-.033-.061-.033-.123-.058-.19-.078-.064-.019-.126-.032-.192-.038C7.059 15.016 7.032 15 7 15H4V9h.879L3.102 7.223C2.451 7.554 2 8.222 2 9v6C2 16.103 2.897 17 4 17z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "white", transform: "-ms-filter" }}
            >
              <path d="M16,21c3.527-1.547,5.999-4.909,5.999-9S19.527,4.547,16,3v2c2.387,1.386,3.999,4.047,3.999,7S18.387,17.614,16,19V21z"></path>
              <path d="M16 7v10c1.225-1.1 2-3.229 2-5S17.225 8.1 16 7zM4 17h2.697l5.748 3.832C12.612 20.943 12.806 21 13 21c.162 0 .324-.039.472-.118C13.797 20.708 14 20.369 14 20V4c0-.369-.203-.708-.528-.882-.324-.175-.72-.154-1.026.05L6.697 7H4C2.897 7 2 7.897 2 9v6C2 16.103 2.897 17 4 17zM4 9h3c.033 0 .061-.016.093-.019.064-.006.125-.02.188-.038.068-.021.131-.045.192-.078.026-.015.057-.017.082-.033L12 5.868v12.264l-4.445-2.964c-.025-.017-.056-.02-.082-.033-.061-.033-.123-.058-.19-.078-.064-.019-.126-.032-.192-.038C7.059 15.016 7.032 15 7 15H4V9z"></path>
            </svg>
          )}
        </button>
        <button onClick={exitSession} className="stopButton">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ fill: "white", transform: "-ms-filter" }}
          >
            <path d="M7 7H17V17H7z"></path>
          </svg>
        </button>
        <button onClick={stopandshowvideo} className="localButton">
          {showVideo ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "white", transform: "-ms-filter" }}
            >
              <path d="M18 7c0-1.103-.897-2-2-2H6.414L3.707 2.293 2.293 3.707l18 18 1.414-1.414L18 16.586v-2.919L22 17V7l-4 3.333V7zM16 14.586L8.414 7H16V14.586zM4 19h10.879l-2-2H4V8.121L2.145 6.265C2.054 6.493 2 6.74 2 7v10C2 18.103 2.897 19 4 19z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "white", transform: "-ms-filter" }}
            >
              <path d="M18,7c0-1.103-0.897-2-2-2H4C2.897,5,2,5.897,2,7v10c0,1.103,0.897,2,2,2h12c1.103,0,2-0.897,2-2v-3.333L22,17V7l-4,3.333 V7z M16.002,17H4V7h12l0.001,4.999L16,12l0.001,0.001L16.002,17z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default Local;

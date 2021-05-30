import * as React from 'react'

interface IProps {
    remoteStreams: (any)[]
}

function Remote({ remoteStreams }: IProps) {
    // side effects
    React.useEffect(() => {
        let mounted = true
        if (mounted) {
            const resolve = remoteStreams.map((event) => initializeRemote(event))
            Promise.all(resolve)
        }
        return (() => { mounted = false })
    }, [remoteStreams])

    // initalize remote streams
    function initializeRemote(event: any) {
        const localViews: any = document.querySelectorAll(".localViews");
        localViews.forEach((localView: any) => {
            if (!localView.srcObject && typeof event === 'object') {
                localView.srcObject = event
            }
        });
    }

    return (
        <div>
            {remoteStreams.map((item: any, index: any) => (
                <div key={index} >
                    {(typeof item === 'object') &&
                        <div className="remoteVideo">
                            <video
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '10px'
                                }}
                                className="localViews"
                                autoPlay
                                playsInline
                            ></video>
                            <div className="remoteControls">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'white', transform: '-ms-filter' }}><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S13.1 10 12 10zM18 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S19.1 10 18 10zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2S7.1 10 6 10z"></path></svg>
                                </div>
                                <button onClick={() => item.getAudioTracks()
                                    .forEach((track: any) => (track.enabled = !track.enabled))} className="remoteButton">
                                    {item.getAudioTracks()[0].enabled ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ fill: '#9CA3AF', transform: '-ms-filter' }}><path d="M21.707 20.293l-2.023-2.023c1.44-1.686 2.315-3.846 2.315-6.27 0-4.091-2.472-7.453-5.999-9v2c2.387 1.386 3.999 4.047 3.999 7 0 1.832-.629 3.543-1.672 4.913l-1.285-1.285C17.644 14.536 18 13.19 18 12c0-1.771-.775-3.9-2-5v7.586l-2-2V4c0-.369-.203-.708-.528-.882-.324-.174-.72-.154-1.026.05L7.727 6.313l-4.02-4.02L2.293 3.707l18 18L21.707 20.293zM12 5.868v4.718L9.169 7.755 12 5.868zM4 17h2.697l5.748 3.832C12.612 20.943 12.806 21 13 21c.162 0 .324-.039.472-.118C13.797 20.708 14 20.369 14 20v-1.879l-2-2v2.011l-4.445-2.964c-.025-.017-.056-.02-.082-.033-.061-.033-.123-.058-.19-.078-.064-.019-.126-.032-.192-.038C7.059 15.016 7.032 15 7 15H4V9h.879L3.102 7.223C2.451 7.554 2 8.222 2 9v6C2 16.103 2.897 17 4 17z"></path></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ fill: '#9CA3AF', transform: '-ms-filter' }}><path d="M16,21c3.527-1.547,5.999-4.909,5.999-9S19.527,4.547,16,3v2c2.387,1.386,3.999,4.047,3.999,7S18.387,17.614,16,19V21z"></path><path d="M16 7v10c1.225-1.1 2-3.229 2-5S17.225 8.1 16 7zM4 17h2.697l5.748 3.832C12.612 20.943 12.806 21 13 21c.162 0 .324-.039.472-.118C13.797 20.708 14 20.369 14 20V4c0-.369-.203-.708-.528-.882-.324-.175-.72-.154-1.026.05L6.697 7H4C2.897 7 2 7.897 2 9v6C2 16.103 2.897 17 4 17zM4 9h3c.033 0 .061-.016.093-.019.064-.006.125-.02.188-.038.068-.021.131-.045.192-.078.026-.015.057-.017.082-.033L12 5.868v12.264l-4.445-2.964c-.025-.017-.056-.02-.082-.033-.061-.033-.123-.058-.19-.078-.064-.019-.126-.032-.192-.038C7.059 15.016 7.032 15 7 15H4V9z"></path></svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    }
                </div>
            ))}
        </div>
    )
}

export default Remote

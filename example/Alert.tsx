import * as React from 'react'

interface IProps {
    closeAlert: () => void
}

function Alert({ closeAlert }: IProps) {
    const [today, setToday] = React.useState<string>(new Date().toLocaleString())
    const [sessionURL, setSessionURL] = React.useState<string>(window.location.href)

    return (
        <div>
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '14px' }}>Kinesis Video Streams Example</div>
                    <button onClick={closeAlert} style={{ color: 'black', fontSize: '14px', backgroundColor: 'white', cursor: 'pointer', border: 'transparent', outline: '2px solid transparent', outlineOffset: '2px' }}>
                        x
                    </button>
                </div>
                <div style={{ color: '#6B7280', marginBottom: '1rem' }}>Share this link to others so they can join this meeting. <span style={{ fontWeight: 'bold' }}>Maximum 10</span> people</div>
                <div style={{ display: 'flex', backgroundColor: '#EFF6FF', padding: '0.4rem', marginTop: '0.5rem', marginBottom: '0.5rem', borderRadius: '5px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <input
                        style={{ outline: '2px solid transparent', outlineOffset: '2px', border: 'transparent', backgroundColor: '#EFF6FF', width: '100%' }}
                        name="sessionAlert"
                        id="sessionAlert"
                        placeholder="Session url"
                        value={sessionURL}
                        readOnly
                        onChange={(event) => setSessionURL(event?.target.value)}
                    ></input>
                    <button
                        style={{ cursor: 'pointer', backgroundColor: '#EFF6FF', border: 'transparent', outline: '2px solid transparent', outlineOffset: '2px' }}
                        onClick={() => navigator.clipboard.writeText(sessionURL)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: '#3B82F6', transform: '-ms-filter' }}><path d="M20,2H10C8.897,2,8,2.897,8,4v4H4c-1.103,0-2,0.897-2,2v10c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2v-4h4 c1.103,0,2-0.897,2-2V4C22,2.897,21.103,2,20,2z M4,20V10h10l0.002,10H4z M20,14h-4v-4c0-1.103-0.897-2-2-2h-4V4h10V14z"></path></svg>
                    </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style={{ fill: '#3B82F6', transform: '-ms-filter' }}><path d="M11.488,21.754c0.294,0.157,0.663,0.156,0.957-0.001c8.012-4.304,8.581-12.713,8.574-15.104 c-0.001-0.394-0.235-0.744-0.596-0.903L12.373,2.18c-0.259-0.114-0.554-0.114-0.813,0.001L3.566,5.747 C3.211,5.906,2.979,6.25,2.974,6.639C2.94,9.018,3.419,17.445,11.488,21.754z M8.674,10.293l2.293,2.293l4.293-4.293l1.414,1.414 l-5.707,5.707L7.26,11.707L8.674,10.293z"></path></svg>
                    <span
                        style={{ color: '#6B7280', fontSize: '14px', marginLeft: '0.5rem' }}
                    >All content for this meeting are encrypted end to end. Your security
                        is our responsibilty</span
                    >
                </div>
                <div style={{ fontSize: '13px', marginTop: '1rem' }}>
                    {today}
                </div> 
        </div>
    )
}

export default Alert

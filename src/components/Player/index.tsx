import React, { useState, useRef, useEffect } from 'react'
import { MdFullscreen, MdFullscreenExit, MdOutlineVolumeUp, MdPause, MdPlayArrow } from 'react-icons/md'
import { Description } from '../Description';
import { ListVideos } from '../ListVideos';

interface IPlayerState {
    playing: boolean,
    percentage: number,
    fullscreen: boolean,
}

const classAttributesControls = {
    'class': 'flex flex-col'
}

function usePlayerState($videoPlayer: React.MutableRefObject<HTMLVideoElement | null>): { playerState: IPlayerState;
    toggleVideoPlay: () => void; handleTimeUpdate: () => void; handleChangeVideoPercentage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleModifyVideoSpeed: (event: React.ChangeEvent<HTMLSelectElement>) => void; handleFullscreenVideo: () => void;
}
{
    const [playerState, setPlayerState] = useState<IPlayerState>({
        playing: false,
        percentage: 0,
        fullscreen: false
    })

    useEffect(() => {
        playerState.playing ? $videoPlayer.current?.play() : $videoPlayer.current?.pause()
    }, [
        $videoPlayer,
        playerState.playing
    ])

      function toggleVideoPlay() {
        setPlayerState({
          ...playerState,
          playing: !playerState.playing
        })
    }

    function handleTimeUpdate() {
        const getCurrentPercentage =  Number($videoPlayer.current && ($videoPlayer.current?.currentTime / $videoPlayer.current?.duration) * 100)

        setPlayerState({
            ...playerState,
            percentage: getCurrentPercentage
        })
    }

    function handleChangeVideoPercentage(event: React.ChangeEvent<HTMLInputElement>) {
        const getCurrentPercentageValue =  Number((event.target as HTMLInputElement).value)
        $videoPlayer.current!.currentTime = Number($videoPlayer.current!.duration / 100 * getCurrentPercentageValue)

        setPlayerState({
            ...playerState,
            percentage: getCurrentPercentageValue
        })
    }

    function handleModifyVideoSpeed(event: React.ChangeEvent<HTMLSelectElement>) {
        const getValueSpeedVideo = Number(event.target.value)

        $videoPlayer.current!.playbackRate = getValueSpeedVideo
    }

    function handleFullscreenVideo() {
        const templeteNormalVideo = 'w-full aspect-video'
        const templeteFullscreenVideo = 'w-screen h-screen aspect-video'

        $videoPlayer.current!.className = playerState.fullscreen ? templeteFullscreenVideo : templeteNormalVideo;
        
        // Controls the fullscreen
        const controls: Element | null = $videoPlayer.current!.nextElementSibling

        controls!.className = playerState.fullscreen ? `${classAttributesControls.class} absolute bottom-0 w-full` : `${classAttributesControls.class} relative`
        
        setPlayerState({
            ...playerState,
            fullscreen: !playerState.fullscreen
        })
    }

    return {
        playerState,
        toggleVideoPlay,
        handleTimeUpdate,
        handleChangeVideoPercentage,
        handleModifyVideoSpeed,
        handleFullscreenVideo
    }
}

export const Player = () => {
    const $videoPlayer = useRef<HTMLVideoElement | null>(null)
    const { playerState, toggleVideoPlay, handleTimeUpdate, handleChangeVideoPercentage, handleModifyVideoSpeed, handleFullscreenVideo } = usePlayerState($videoPlayer)

  return (
    <div>
        <video
            ref={$videoPlayer}
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            onTimeUpdate={handleTimeUpdate}
            className='w-full aspect-video relative'
        />
        <div className={classAttributesControls.class}>
            <input className='range-sm w-full h-1 bg-black cursor-pointer z-40'
                type="range" name="" id="" 
                min="0"
                max="100"
                onChange={handleChangeVideoPercentage}
                value={playerState.percentage}
            />
            <div className='flex justify-between container mx-auto  items-center'>
                <div className='flex gap-2'>
                    <button onClick={toggleVideoPlay}>
                    { playerState.playing ? <MdPause/> : <MdPlayArrow/> }
                    </button>
                    <button>
                        <MdOutlineVolumeUp />
                    </button>
                </div>
                
                <div className='flex gap-4 items-center pt-1'>
                    <select  className='text-black bg-gray-50 border border-gray-300 text-sm rounded-lg' onChange={handleModifyVideoSpeed}>
                        {
                        [1, 2, 3].map((speed) => {
                            return <option key={ speed }>
                                { speed }
                            </option>
                        })
                        }
                    </select>
                    <div className="fullscreen flex">
                        <button onClick={handleFullscreenVideo}>
                            { playerState.fullscreen ? <MdFullscreen /> : <MdFullscreenExit /> }
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <Description />
        <ListVideos />
    </div>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import { MdFullscreen, MdFullscreenExit, MdOutlineVolumeUp, MdPause, MdPlayArrow, MdVolumeOff } from 'react-icons/md'
import { Description } from '../Description';
import { ListVideos } from '../ListVideos';

interface IPlayerState {
    playing: boolean,
    percentage: number,
    volume: number,
    fullscreen: boolean,
}

const classAttributesControls = {
    'class': 'flex flex-col'
}

function usePlayerState($videoPlayer: React.MutableRefObject<HTMLVideoElement | null>, volumeBarControl: React.MutableRefObject<HTMLInputElement | null>): { 
    playerState: IPlayerState;
    toggleVideoPlay: () => void; handleTimeUpdate: () => void; handleVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleActiveVolumeBar: (event: React.MouseEvent<HTMLButtonElement>) => void; handleVolumeMuted: () => void; handleChangeVideoPercentage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleModifyVideoSpeed: (event: React.ChangeEvent<HTMLSelectElement>) => void; handleFullscreenVideo: () => void;
}
{
    const [playerState, setPlayerState] = useState<IPlayerState>({
        playing: false,
        percentage: 0,
        volume: 100,
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

    function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Number((event.target as HTMLInputElement).value) / 100
        const setVolume = $videoPlayer.current!.volume = value

        setPlayerState({
            ...playerState,
            volume: setVolume
        })
    }

    function handleActiveVolumeBar(event: React.MouseEvent<HTMLButtonElement>) {
        volumeBarControl.current?.classList.remove('hidden')
        event.target?.addEventListener('mouseleave', () => volumeBarControl.current?.classList.add('hidden'))
    }

    function handleVolumeMuted() {
        const setVolume = $videoPlayer.current!.volume === 0 ? $videoPlayer.current!.volume = 1 : $videoPlayer.current!.volume = 0

        setPlayerState({ ...playerState, volume: setVolume })
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
        handleVolumeChange,
        handleActiveVolumeBar,
        handleVolumeMuted,
        handleModifyVideoSpeed,
        handleFullscreenVideo
    }
}

export const Player = () => {
    const $videoPlayer = useRef<HTMLVideoElement | null>(null)
    const volumeBarControl = useRef<HTMLInputElement | null>(null)
    const { playerState, toggleVideoPlay, handleTimeUpdate, handleChangeVideoPercentage, handleVolumeChange, handleActiveVolumeBar, handleVolumeMuted, handleModifyVideoSpeed, handleFullscreenVideo } = usePlayerState($videoPlayer, volumeBarControl)

  return (
    <div>
        <video
            ref={$videoPlayer}
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            onTimeUpdate={handleTimeUpdate}
            onClick={toggleVideoPlay}
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
            <div className='flex justify-between container mx-auto items-center'>
                <div className='flex gap-2'>
                    <button onClick={toggleVideoPlay}>
                    { playerState.playing ? <MdPause/> : <MdPlayArrow/> }
                    </button>
                    <button className='flex gap-1 items-center' onMouseOver={handleActiveVolumeBar}>
                        {playerState.volume === 0 ? <MdVolumeOff onClick={handleVolumeMuted} /> : <MdOutlineVolumeUp onClick={handleVolumeMuted} />}
                        <input  
                            ref={volumeBarControl}
                            className='range-sm w-12 h-1 bg-black cursor-pointer z-40 hidden'
                            type="range" name="" id="" 
                            min="0"
                            max="100"
                            onChange={handleVolumeChange}
                            value={playerState.volume * 100}
                        />
                    </button>
                </div>
                
                <div className='flex gap-4 items-center pt-1'>
                    <select  className='text-black bg-gray-50 border border-gray-300 text-sm rounded-lg cursor-pointer' onChange={handleModifyVideoSpeed}>
                        {
                        [1, 2, 3].map((speed) => {
                            return <option className='cursor-pointer' key={ speed }>
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

import Head from 'next/head'
import { useEffect, useState } from 'react'
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'

export default function ArabicPlayer(props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || typeof window === 'undefined') {
      return
    }

    const videoURLs = [
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_01_alif.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_02_baa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_03_taa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_04_thaa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_05_jiim.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_06_Haa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_07_khaa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_08_daal.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_09_dhaal.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_10_raa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_11_zaay.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_12_seen.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_13_sheen.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_14_Saad.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_15_Daad.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_16_Taaa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_17_Dhaa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_18_ayn.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_19_ghayn.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_20_faa.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_21_qaaf.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_22_kaaf.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_23_laam.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_24_miim.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_25_nuun.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_26_ha.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_27_waaw.mp4',
      'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_28_yaa.mp4'
    ]

    const letters = [
      'ا',
      'ب',
      'ت',
      'ث',
      'ج',
      'ح',
      'خ',
      'د',
      'ذ',
      'ر',
      'ز',
      'س',
      'ش',
      'ص',
      'ض',
      'ط',
      'ظ',
      'ع',
      'غ',
      'ف',
      'ق',
      'ك',
      'ل',
      'م',
      'ن',
      'ه',
      'و',
      'ي'
    ]

    let isPlaying = false
    let currentIndex = 0
    let delay = 2000
    let currentLoopIteration = 0
    let maxLoops = 0
    let videoPlayer = null
    let playMode = 'auto'
    let nextVideoScheduled = false

    const clearScheduledNext = () => {
      nextVideoScheduled = false
    }

    const updateStatusInfo = text => {
      const statusInfo = document.getElementById('statusInfo')
      if (statusInfo) {
        statusInfo.textContent = text
      }
    }

    const updateProgress = () => {
      const currentLetter = document.getElementById('currentLetter')
      const currentIndexEl = document.getElementById('currentIndex')
      const progressFill = document.getElementById('progressFill')
      if (currentLetter) {
        currentLetter.textContent = letters[currentIndex]
      }
      if (currentIndexEl) {
        currentIndexEl.textContent = currentIndex + 1
      }
      if (progressFill) {
        const progress = ((currentIndex + 1) / letters.length) * 100
        progressFill.style.width = progress + '%'
      }

      document.querySelectorAll('.letter-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex)
        item.classList.toggle('playing', index === currentIndex && isPlaying)
      })
    }

    const onVideoEnded = () => {
      if (isPlaying && playMode === 'auto') {
        playNext()
      }
    }

    const onVideoError = () => {
      if (isPlaying && playMode === 'auto') {
        setTimeout(playNext, 1000)
      }
    }

    const onVideoPlaying = () => {
      updateStatusInfo('Playing...')
    }

    const setupVideoEventListeners = () => {
      if (!videoPlayer) return
      videoPlayer.addEventListener('ended', onVideoEnded)
      videoPlayer.addEventListener('error', onVideoError)
      videoPlayer.addEventListener('playing', onVideoPlaying)
    }

    const removeVideoEventListeners = () => {
      if (!videoPlayer) return
      videoPlayer.removeEventListener('ended', onVideoEnded)
      videoPlayer.removeEventListener('error', onVideoError)
      videoPlayer.removeEventListener('playing', onVideoPlaying)
    }

    const playLetterVideo = index => {
      currentIndex = index
      updateProgress()

      if (!videoPlayer) return
      videoPlayer.pause()
      videoPlayer.removeAttribute('src')
      videoPlayer.load()

      videoPlayer.src = videoURLs[index]
      videoPlayer.load()

      updateStatusInfo('Loading...')

      videoPlayer.play().catch(err => {
        console.error('Unable to play: ' + letters[index], err)
        updateStatusInfo('Loading failed: ' + err.message)
      })
    }

    const playNext = () => {
      if (!isPlaying) return
      if (nextVideoScheduled) return
      nextVideoScheduled = true

      setTimeout(() => {
        clearScheduledNext()
        playLetterVideo(currentIndex)
        currentIndex++

        if (currentIndex >= letters.length) {
          currentIndex = 0
          currentLoopIteration++

          if (maxLoops > 0 && currentLoopIteration >= maxLoops) {
            isPlaying = false
            const startBtn = document.getElementById('startBtn')
            const pauseBtn = document.getElementById('pauseBtn')
            const skipBtn = document.getElementById('skipBtn')
            if (startBtn) startBtn.disabled = false
            if (pauseBtn) pauseBtn.disabled = true
            if (skipBtn) skipBtn.disabled = true
            updateStatusInfo('Loop completed')
            alert('✓ Loop playback completed!')
            return
          }

          const autoRestart = document.getElementById('autoRestart')
          if (
            autoRestart &&
            !autoRestart.checked &&
            currentLoopIteration > 0
          ) {
            isPlaying = false
            const startBtn = document.getElementById('startBtn')
            const pauseBtn = document.getElementById('pauseBtn')
            const skipBtn = document.getElementById('skipBtn')
            if (startBtn) startBtn.disabled = false
            if (pauseBtn) pauseBtn.disabled = true
            if (skipBtn) skipBtn.disabled = true
            updateStatusInfo('Paused')
            return
          }
        }
      }, playMode === 'auto' ? 300 : delay)
    }

    const startLoop = () => {
      if (isPlaying) return
      isPlaying = true
      const startBtn = document.getElementById('startBtn')
      const pauseBtn = document.getElementById('pauseBtn')
      const skipBtn = document.getElementById('skipBtn')
      if (startBtn) startBtn.disabled = true
      if (pauseBtn) pauseBtn.disabled = false
      if (skipBtn) skipBtn.disabled = false

      const repeatCount = document.getElementById('repeatCount')
      maxLoops = parseInt(repeatCount?.value, 10) || 0
      currentLoopIteration = 0

      playNext()
    }

    const skipToNext = () => {
      if (isPlaying && videoPlayer) {
        videoPlayer.pause()
        playNext()
      }
    }

    const pauseLoop = () => {
      isPlaying = false
      if (videoPlayer) {
        videoPlayer.pause()
      }
      clearScheduledNext()
      const startBtn = document.getElementById('startBtn')
      const pauseBtn = document.getElementById('pauseBtn')
      const skipBtn = document.getElementById('skipBtn')
      if (startBtn) startBtn.disabled = false
      if (pauseBtn) pauseBtn.disabled = true
      if (skipBtn) skipBtn.disabled = true
      updateStatusInfo('Paused')
    }

    const resetLoop = () => {
      isPlaying = false
      clearScheduledNext()
      currentIndex = 0
      currentLoopIteration = 0
      if (videoPlayer) {
        videoPlayer.pause()
        videoPlayer.currentTime = 0
      }
      const startBtn = document.getElementById('startBtn')
      const pauseBtn = document.getElementById('pauseBtn')
      const skipBtn = document.getElementById('skipBtn')
      if (startBtn) startBtn.disabled = false
      if (pauseBtn) pauseBtn.disabled = true
      if (skipBtn) skipBtn.disabled = true
      updateStatusInfo('Reset')
      updateProgress()
    }

    const switchMode = mode => {
      playMode = mode
      const manualSettings = document.getElementById('manualSettings')
      if (!manualSettings) return
      if (mode === 'auto') {
        manualSettings.style.display = 'none'
        updateStatusInfo('Smart Mode: Waits for video completion before playing next')
      } else {
        manualSettings.style.display = 'block'
        updateStatusInfo('Timed Mode: Plays at fixed intervals')
      }
    }

    const updateDelay = value => {
      delay = parseFloat(value) * 1000
      const delayValue = document.getElementById('delayValue')
      if (delayValue) {
        delayValue.textContent = value
      }
    }

    const initializeUI = () => {
      videoPlayer = document.getElementById('videoPlayer')
      const grid = document.getElementById('lettersGrid')
      const totalCount = document.getElementById('totalCount')

      if (!videoPlayer || !grid || !totalCount) {
        return
      }

      grid.innerHTML = ''
      letters.forEach((letter, index) => {
        const div = document.createElement('div')
        div.className = 'letter-item'
        div.textContent = letter
        div.onclick = () => playLetterVideo(index)
        grid.appendChild(div)
      })

      totalCount.textContent = letters.length
      updateProgress()
      setupVideoEventListeners()
    }

    const initializePlayer = () => {
      if (window.__arabicPlayerInitialized) {
        return
      }
      window.__arabicPlayerInitialized = true
      initializeUI()
      switchMode(playMode)
    }

    window.startLoop = startLoop
    window.skipToNext = skipToNext
    window.pauseLoop = pauseLoop
    window.resetLoop = resetLoop
    window.switchMode = switchMode
    window.updateDelay = updateDelay

    initializePlayer()

    return () => {
      window.__arabicPlayerInitialized = false
      delete window.startLoop
      delete window.skipToNext
      delete window.pauseLoop
      delete window.resetLoop
      delete window.switchMode
      delete window.updateDelay
      removeVideoEventListeners()
    }
  }, [isClient])

  return (
    <>
      <Head>
        <title>Arabic Letters Pronunciation Player</title>
        <meta name="description" content="Arabic alphabet pronunciation learning tool with smart playback" />
      </Head>
      
      <style jsx global>{`
        .arabic-container {
          background: white;
          dark:bg-gray-800;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 32px;
          margin: 20px auto;
          max-width: 100%;
          width: 100%;
        }

        .dark .arabic-container {
          background: #1f2937;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .arabic-container h1 {
          text-align: center;
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }

        .dark .arabic-container h1 {
          color: #f3f4f6;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }

        .dark .subtitle {
          color: #9ca3af;
        }
        
        .controls {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .arabic-container button {
          padding: 12px 24px;
          font-size: 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background-color: #667eea;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background-color: #f0f0f0;
          color: #333;
        }

        .dark .btn-secondary {
          background-color: #4b5563;
          color: #e5e7eb;
        }

        .btn-secondary:hover {
          background-color: #e0e0e0;
        }

        .dark .btn-secondary:hover {
          background-color: #6b7280;
        }
        
        .settings {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .dark .settings {
          background: #374151;
        }
        
        .setting-group {
          margin-bottom: 15px;
        }
        
        .setting-group:last-child {
          margin-bottom: 0;
        }
        
        .arabic-container label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
          font-size: 14px;
        }

        .dark .arabic-container label {
          color: #e5e7eb;
        }
        
        .arabic-container input[type="number"],
        .arabic-container input[type="range"] {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .dark .arabic-container input[type="number"] {
          background: #4b5563;
          border-color: #6b7280;
          color: #e5e7eb;
        }

        .arabic-container input[type="range"] {
          padding: 0;
          height: 6px;
        }
        
        .status {
          background: #e3f2fd;
          border-left: 4px solid #667eea;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .dark .status {
          background: #1e3a5f;
          border-left-color: #667eea;
        }

        .status-text {
          color: #1976d2;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .dark .status-text {
          color: #93c5fd;
        }
        
        .progress-bar {
          width: 100%;
          height: 6px;
          background: #ddd;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #667eea;
          transition: width 0.3s ease;
        }
        
        .letters-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-top: 20px;
        }
        
        .letter-item {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border-radius: 8px;
          font-size: 24px;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .dark .letter-item {
          background: #4b5563;
          color: #e5e7eb;
        }

        .letter-item:hover {
          background: #e8e8e8;
        }

        .dark .letter-item:hover {
          background: #6b7280;
        }
        
        .letter-item.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
        
        .letter-item.playing::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          bottom: 4px;
          right: 4px;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        .video-preview {
          margin-top: 20px;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          max-height: 300px;
        }
        
        .arabic-container video {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .info {
          background: #d1fae5;
          border-left: 4px solid #10b981;
          padding: 12px;
          border-radius: 4px;
          font-size: 13px;
          color: #065f46;
          margin-top: 20px;
          line-height: 1.5;
        }

        .dark .info {
          background: #064e3b;
          color: #6ee7b7;
        }
        
        .mode-toggle {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .dark .mode-toggle {
          background: #451a03;
          border-left-color: #f59e0b;
        }

        .mode-toggle label {
          margin-bottom: 0;
          color: #78350f;
        }

        .dark .mode-toggle label {
          color: #fcd34d;
        }
      `}</style>

      <div className="arabic-container">
        {!isClient ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            Loading player...
          </div>
        ) : (
          <>
        <h1>🔤 Arabic Letters Pronunciation Player</h1>
        <p className="subtitle">Arabic Letters and Sounds - Smart Playback Edition</p>
        
        <div className="mode-toggle">
          <label>
            <input
              type="radio"
              name="mode"
              value="auto"
              defaultChecked
              onChange={() =>
                typeof window !== 'undefined' &&
                typeof window.switchMode === 'function' &&
                window.switchMode('auto')
              }
            />
            ✅ Smart Mode (Wait for video completion before playing next)
          </label>
          <br />
          <label style={{marginTop: '10px'}}>
            <input
              type="radio"
              name="mode"
              value="manual"
              onChange={() =>
                typeof window !== 'undefined' &&
                typeof window.switchMode === 'function' &&
                window.switchMode('manual')
              }
            />
            ⏱️ Timed Mode (Fixed interval, manually skip)
          </label>
        </div>
        
        <div className="status">
          <div className="status-text">
            Current Progress: <strong id="currentLetter">ا</strong>
            (<span id="currentIndex">1</span>/<span id="totalCount">28</span>)
            <span id="statusInfo" style={{marginLeft: '10px', color: '#666', fontSize: '12px'}}></span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" id="progressFill"></div>
          </div>
        </div>
        
        <div className="controls">
          <button
            className="btn-primary"
            id="startBtn"
            onClick={() =>
              typeof window !== 'undefined' &&
              typeof window.startLoop === 'function' &&
              window.startLoop()
            }
          >
            ▶ Start Loop
          </button>
          <button
            className="btn-secondary"
            id="pauseBtn"
            onClick={() =>
              typeof window !== 'undefined' &&
              typeof window.pauseLoop === 'function' &&
              window.pauseLoop()
            }
            disabled
          >
            ⏸ Pause
          </button>
          <button
            className="btn-secondary"
            id="skipBtn"
            onClick={() =>
              typeof window !== 'undefined' &&
              typeof window.skipToNext === 'function' &&
              window.skipToNext()
            }
            disabled
          >
            Skip
          </button>
          <button
            className="btn-secondary"
            onClick={() =>
              typeof window !== 'undefined' &&
              typeof window.resetLoop === 'function' &&
              window.resetLoop()
            }
          >
            🔄 Reset
          </button>
        </div>
        
        <div className="settings" id="manualSettings" style={{display: 'none'}}>
          <div className="setting-group">
            <label htmlFor="delaySlider">Playback Interval: <strong id="delayValue">2</strong> seconds</label>
            <input
              type="range"
              id="delaySlider"
              min="0.5"
              max="5"
              step="0.5"
              defaultValue="2"
              onChange={e =>
                typeof window !== 'undefined' &&
                typeof window.updateDelay === 'function' &&
                window.updateDelay(e.target.value)
              }
            />
          </div>
        </div>

        <div className="settings">
          <div className="setting-group">
            <label htmlFor="repeatCount">Loop Count: <strong id="repeatValue">∞ (Infinite)</strong></label>
            <input type="number" id="repeatCount" min="1" max="100" defaultValue="0" placeholder="0 = Infinite loop" />
          </div>

          <div className="setting-group">
            <label>
              <input type="checkbox" id="autoRestart" defaultChecked /> Auto-restart when loop completes
            </label>
          </div>
        </div>
        
            <div className="letters-grid" id="lettersGrid"></div>
            
            <div className="video-preview">
              <video id="videoPlayer" controls>
                <source src="" type="video/mp4" />
                Your browser does not support video playback
              </video>
            </div>

            <div className="info">
              ✅ Smart Mode: Player waits for each video to complete before automatically playing the next, avoiding skips during buffering
            </div>
          </>
        )}
      </div>

      {isClient && (
        <script dangerouslySetInnerHTML={{__html: `
        window.initializePlayer = function() {
        if (window.__arabicPlayerInitialized) {
          return;
        }
        window.__arabicPlayerInitialized = true;
        // Complete list of 28 Arabic letter video URLs
        const videoURLs = [
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_01_alif.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_02_baa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_03_taa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_04_thaa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_05_jiim.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_06_Haa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_07_khaa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_08_daal.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_09_dhaal.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_10_raa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_11_zaay.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_12_seen.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_13_sheen.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_14_Saad.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_15_Daad.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_16_Taaa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_17_Dhaa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_18_ayn.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_19_ghayn.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_20_faa.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_21_qaaf.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_22_kaaf.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_23_laam.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_24_miim.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_25_nuun.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_26_ha.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_27_waaw.mp4',
          'https://lingco-classroom-prod.s3.us-east-2.amazonaws.com/uploaded_video/master_files/alif_baa/AB3e_pronouncing_28_yaa.mp4'
        ];
        
        // Arabic letters list
        const letters = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
        
        let isPlaying = false;
        let currentIndex = 0;
        let delay = 2000;
        let currentLoopIteration = 0;
        let maxLoops = 0;
        let videoPlayer;
        let playMode = 'auto';
        let nextVideoScheduled = false;
        
        // Initialize UI
        function initializeUI() {
          videoPlayer = document.getElementById('videoPlayer');
          const grid = document.getElementById('lettersGrid');
          if (!grid) {
            return;
          }
          grid.innerHTML = '';
          letters.forEach((letter, index) => {
            const div = document.createElement('div');
            div.className = 'letter-item';
            div.textContent = letter;
            div.onclick = () => playLetterVideo(index);
            grid.appendChild(div);
          });
          
          document.getElementById('totalCount').textContent = letters.length;
          updateProgress();
          setupVideoEventListeners();
        }
        
        // Setup video event listeners
        function setupVideoEventListeners() {
          videoPlayer.addEventListener('ended', onVideoEnded);
          videoPlayer.addEventListener('error', onVideoError);
          videoPlayer.addEventListener('playing', onVideoPlaying);
        }
        
        // Event when video playback completes
        function onVideoEnded() {
          if (isPlaying && playMode === 'auto') {
            console.log('Video completed, preparing to play next');
            playNext();
          }
        }
        
        // Event when video loading fails
        function onVideoError() {
          console.warn('Video loading error', videoPlayer.error);
          if (isPlaying && playMode === 'auto') {
            setTimeout(playNext, 1000);
          }
        }
        
        // Event when video starts playing
        function onVideoPlaying() {
          updateStatusInfo('Playing...');
        }
        
        // Update status information
        function updateStatusInfo(text) {
          document.getElementById('statusInfo').textContent = text;
        }
        
        // Update progress display
        function updateProgress() {
          document.getElementById('currentLetter').textContent = letters[currentIndex];
          document.getElementById('currentIndex').textContent = currentIndex + 1;
          
          const progress = ((currentIndex + 1) / letters.length) * 100;
          document.getElementById('progressFill').style.width = progress + '%';
          
          // Update letter highlighting
          document.querySelectorAll('.letter-item').forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
            item.classList.toggle('playing', index === currentIndex && isPlaying);
          });
        }
        
        // Play letter video
        function playLetterVideo(index) {
          currentIndex = index;
          updateProgress();
          
          videoPlayer.pause();
          videoPlayer.removeAttribute('src');
          videoPlayer.load();

          videoPlayer.src = videoURLs[index];
          videoPlayer.load();
          updateStatusInfo('Loading...');
          
          videoPlayer.play().catch(err => {
            console.error('Unable to play: ' + letters[index], err);
            updateStatusInfo('Loading failed: ' + err.message);
          });
        }
        
        // Start loop playback
        window.startLoop = function() {
          if (isPlaying) return;
          isPlaying = true;
          document.getElementById('startBtn').disabled = true;
          document.getElementById('pauseBtn').disabled = false;
          document.getElementById('skipBtn').disabled = false;
          
          maxLoops = parseInt(document.getElementById('repeatCount').value) || 0;
          currentLoopIteration = 0;
          
          playNext();
        }
        
        // Play next letter
        function playNext() {
          if (!isPlaying) return;
          
          if (nextVideoScheduled) return;
          nextVideoScheduled = true;
          
          setTimeout(() => {
            nextVideoScheduled = false;
            
            playLetterVideo(currentIndex);
            currentIndex++;
            
            if (currentIndex >= letters.length) {
              currentIndex = 0;
              currentLoopIteration++;
              
              if (maxLoops > 0 && currentLoopIteration >= maxLoops) {
                isPlaying = false;
                document.getElementById('startBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = true;
                document.getElementById('skipBtn').disabled = true;
                updateStatusInfo('Loop completed');
                alert('✓ Loop playback completed!');
                return;
              }
              
              if (!document.getElementById('autoRestart').checked && currentLoopIteration > 0) {
                isPlaying = false;
                document.getElementById('startBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = true;
                document.getElementById('skipBtn').disabled = true;
                updateStatusInfo('Paused');
                return;
              }
            }
          }, playMode === 'auto' ? 300 : delay);
        }
        
        // Manually skip to next
        window.skipToNext = function() {
          if (isPlaying) {
            videoPlayer.pause();
            playNext();
          }
        }
        
        // Pause playback
        window.pauseLoop = function() {
          isPlaying = false;
          videoPlayer.pause();
          nextVideoScheduled = false;
          document.getElementById('startBtn').disabled = false;
          document.getElementById('pauseBtn').disabled = true;
          document.getElementById('skipBtn').disabled = true;
          updateStatusInfo('Paused');
        }

        // Reset
        window.resetLoop = function() {
          isPlaying = false;
          nextVideoScheduled = false;
          currentIndex = 0;
          currentLoopIteration = 0;
          videoPlayer.pause();
          videoPlayer.currentTime = 0;
          document.getElementById('startBtn').disabled = false;
          document.getElementById('pauseBtn').disabled = true;
          document.getElementById('skipBtn').disabled = true;
          updateStatusInfo('Reset');
          updateProgress();
        }
        
        // Switch playback mode
        window.switchMode = function(mode) {
          playMode = mode;
          const manualSettings = document.getElementById('manualSettings');
          
          if (mode === 'auto') {
            manualSettings.style.display = 'none';
            updateStatusInfo('Smart Mode: Waits for video completion before playing next');
          } else {
            manualSettings.style.display = 'block';
            updateStatusInfo('Timed Mode: Plays at fixed intervals');
          }
        }
        
        // Update delay time
        window.updateDelay = function(value) {
          delay = parseFloat(value) * 1000;
          document.getElementById('delayValue').textContent = value;
        }
        
        // Initialize UI
        initializeUI();
        window.switchMode(playMode);
        }
      `}} />
      )}
    </>
  )
}


export async function getStaticProps({ locale }) {
  const props = await getGlobalData({ from: 'arabic-player', locale })
  delete props.allPages

  if (Array.isArray(props?.categoryOptions)) {
    props.categoryOptions = props.categoryOptions.filter(Boolean)
  } else {
    props.categoryOptions = []
  }

  if (Array.isArray(props?.tagOptions)) {
    props.tagOptions = props.tagOptions.filter(Boolean)
  } else {
    props.tagOptions = []
  }

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}


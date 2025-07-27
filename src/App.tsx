import { useEffect, useRef, useState } from "react";
import "./App.css";
import VideoPlayer from "./VideoPlayer";
import videojs from "video.js";
import isFastNet from "isfastnet";
import "videojs-contrib-quality-levels";
import Navbar from "./Navbar";

// --- Batching log logic ---
type LogLevel = "log" | "warn" | "error";
interface BatchedLog {
  level: LogLevel;
  message: string;
  details?: unknown;
  timestamp: string;
}

const LOG_BATCH_SIZE = 30;
const LOG_FLUSH_INTERVAL = 60000; // ms
let logBatch: BatchedLog[] = [];
let logFlushTimer: ReturnType<typeof setTimeout> | null = null;

// --- Play/Pause event counters ---
let playCount = 0;
let pauseCount = 0;

function flushLogs() {
  if (logBatch.length === 0 && playCount === 0 && pauseCount === 0) return;
  // Add play/pause summary log if there were any events
  if (playCount > 0 || pauseCount > 0) {
    logBatch.push({
      level: "log",
      message: "[UI] Play/Pause summary",
      details: { playCount, pauseCount },
      timestamp: new Date().toISOString(),
    });
    playCount = 0;
    pauseCount = 0;
  }
  // Send logs to backend API
  if (logBatch.length > 0) {
    fetch("http://localhost:3000/api/log-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logBatch),
    }).catch((err) => {
      // Optionally handle error (e.g., retry, queue, etc.)
      console.error("Failed to send logs to backend:", err);
      flushLogs();
    });
  }
  // For now, just output to console
  console.log("[BATCHED LOGS FLUSH]", logBatch);
  logBatch = [];
}

function scheduleFlush() {
  if (logFlushTimer) return;
  logFlushTimer = setTimeout(() => {
    flushLogs();
    logFlushTimer = null;
  }, LOG_FLUSH_INTERVAL);
}

function logEvent(level: LogLevel, message: string, details?: unknown) {
  const logEntry: BatchedLog = {
    level,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
  logBatch.push(logEntry);
  // Also log immediately for developer visibility
  switch (level) {
    case "log":
      videojs.log(message, details, `[${logEntry.timestamp}]`);
      break;
    case "warn":
      videojs.log.warn(message, details, `[${logEntry.timestamp}]`);
      break;
    case "error":
      videojs.log.error(message, details, `[${logEntry.timestamp}]`);
      break;
  }
  if (logBatch.length >= LOG_BATCH_SIZE) {
    flushLogs();
    if (logFlushTimer) {
      clearTimeout(logFlushTimer);
      logFlushTimer = null;
    }
  } else {
    scheduleFlush();
  }
}

function App() {
  // const videoSrc =
  // "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";
  const videoSrc =
    "https://d1bdbpg2kollp.cloudfront.net/out/v1/80d0969d606a4e48ae4d9808c08e9c5a/index-raj-001.m3u8";

  const playerRef = useRef(null);
  const [speed, setSpeed] = useState<boolean>(true);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoSrc,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    player.on("dispose", () => {
      logEvent("log", "player dispose");
    });

    // Error-related event logging
    player.on("error", () => {
      const error = player.error();
      logEvent(
        "error",
        "[ERR]",
        error
          ? {
              code: error.code,
              message: error.message,
              status: error.status,
              metadata: error.metadata,
            }
          : "Unknown error"
      );
    });
    player.on("abort", () => {
      logEvent("error", "[ERR] Media load aborted");
    });
    player.on("stalled", () => {
      logEvent("error", "[ERR] stalled");
    });
    player.on("suspend", () => {
      logEvent("error", "[ERR] suspend");
    });
    player.on("emptied", () => {
      logEvent("error", "[ERR] emptied");
    });

    // Buffering-related event logging
    let rebufferingStart: number | null = null;
    let totalRebufferingTime: number = 0;

    player.on("waiting", () => {
      logEvent("log", "[BUF] waiting");
      if (rebufferingStart === null) {
        rebufferingStart = Date.now();
      }
    });
    player.on("playing", () => {
      if (rebufferingStart !== null) {
        const rebufferDuration = (Date.now() - rebufferingStart) / 1000;
        totalRebufferingTime += rebufferDuration;
        logEvent(
          "log",
          `[BUF] rebuffer ${rebufferDuration.toFixed(
            2
          )}s, total ${totalRebufferingTime.toFixed(2)}s`
        );
        rebufferingStart = null;
      }
    });
    player.on("canplay", () => {
      if (rebufferingStart !== null) {
        const rebufferDuration = (Date.now() - rebufferingStart) / 1000;
        totalRebufferingTime += rebufferDuration;
        logEvent(
          "log",
          `[BUF] rebuffer ${rebufferDuration.toFixed(
            2
          )}s, total ${totalRebufferingTime.toFixed(2)}s`
        );
        rebufferingStart = null;
      }
      logEvent("log", "[BUF] canplay");
    });
    player.on("canplaythrough", () => {
      // logEvent("log", "[BUF] canplaythrough");
    });
    player.on("seeking", () => {
      logEvent("log", "[BUF] seeking");
    });

    // Type for Network Information API
    interface NetworkInformation {
      effectiveType: string;
      addEventListener: (type: string, listener: () => void) => void;
    }

    // Network connectivity monitoring
    const navWithConn = navigator as Navigator & {
      connection?: NetworkInformation;
    };
    if (navWithConn.connection) {
      const logConnectionChange = () => {
        const connection = navWithConn.connection!;
        // Log the effective connection type
        logEvent("log", `[NET] type: ${connection.effectiveType}`);
        // Warn if connection drops to poor quality
        if (
          connection.effectiveType === "2g" ||
          connection.effectiveType === "3g" ||
          connection.effectiveType === "slow-2g"
        ) {
          logEvent("warn", `[NET] poor (${connection.effectiveType})`);
        }
      };
      navWithConn.connection.addEventListener("change", logConnectionChange);
      // Initial log
      logConnectionChange();
    }

    // Enhance 'stalled' and 'waiting' events with network info
    const logNetworkOnBuffer = (eventName: string) => {
      let networkType = "unknown";
      const navWithConn = navigator as Navigator & {
        connection?: NetworkInformation;
      };
      if (navWithConn.connection) {
        networkType = navWithConn.connection.effectiveType;
      }
      logEvent("warn", `[NET/BUF] ${eventName} net: ${networkType}`);
    };
    player.on("stalled", () => logNetworkOnBuffer("stalled"));
    player.on("waiting", () => logNetworkOnBuffer("waiting"));

    // Video quality change logging (using the plugin, videojs-contrib-quality-levels)
    if (typeof player.qualityLevels === "function") {
      const qualityLevels = player.qualityLevels();
      qualityLevels.on("change", function () {
        const selectedIndex = qualityLevels.selectedIndex;
        if (selectedIndex !== -1) {
          const level = qualityLevels[selectedIndex];
          logEvent(
            "warn",
            `[QUAL] ${level.height || "?"}p, ${level.bitrate || "?"}bps, id:${
              level.id || "?"
            }`
          );
        } else {
          logEvent("warn", "[QUAL] changed, no level");
        }
      });
    } else {
      logEvent("warn", "[QUAL] not supported");
    }

    // --- User interaction event logging ---
    player.on("play", () => {
      playCount++;
    });
    player.on("pause", () => {
      pauseCount++;
    });
    player.on("volumechange", () => {
      logEvent("log", "[UI] volume", {
        volume: player.volume(),
        muted: player.muted(),
      });
    });
    player.on("fullscreenchange", () => {
      logEvent("log", "[UI] fullscreen", {
        isFullscreen: player.isFullscreen(),
      });
    });
    player.on("ratechange", () => {
      logEvent("log", "[UI] rate", {
        playbackRate: player.playbackRate(),
      });
    });
  };

  useEffect(() => {
    isFastNet((value: boolean) => {
      setSpeed(value);
    });
  }, []);

  return (
    <>
      <div>
        <Navbar />
        <div
          style={{
            padding: "20px",
            marginTop: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "1280px",
            margin: "80px auto 0 auto",
          }}
        >
          <p>
            {!speed
              ? "Your internet connectivity is slow. To ensure seam-less streaming experience, please switch to a faster internet connectivity."
              : null}
          </p>
          <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
      </div>
    </>
  );
}

export default App;

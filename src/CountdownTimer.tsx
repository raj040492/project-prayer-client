import { useState, useEffect, useRef } from "react";

interface CountdownTimerProps {
  eventEndTime: Date;
  onEventConcluded: () => void;
}

// Notification permission and setup
const requestNotificationPermission = async () => {
  console.log("Checking notification support...");

  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  console.log("Current notification permission:", Notification.permission);

  if (Notification.permission === "granted") {
    console.log("Notification permission already granted");
    return true;
  }

  if (Notification.permission === "denied") {
    console.log("Notification permission denied by user");
    return false;
  }

  if (Notification.permission === "default") {
    console.log("Requesting notification permission...");
    try {
      const permission = await Notification.requestPermission();
      console.log("Permission result:", permission);
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  return false;
};

const sendNotification = (title: string, body: string) => {
  console.log("Notification permission status:", Notification.permission);
  console.log("Current URL:", window.location.href);
  console.log(
    "Is localhost:",
    window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
  );

  if (Notification.permission === "granted") {
    console.log("Sending notification:", title, body);
    try {
      const notification = new Notification(title, {
        body,
        icon: window.location.origin + "/vite.svg", // Use absolute path
        badge: window.location.origin + "/vite.svg",
        tag: "event-countdown",
        requireInteraction: false, // Changed to false for better compatibility
        silent: false, // Ensure sound plays
      });

      notification.onclick = () => {
        console.log("Notification clicked");
        window.focus();
        notification.close();
      };

      notification.onshow = () => {
        console.log("Notification shown successfully");
        // Also try to play a sound as fallback
        try {
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
          );
          audio.play().catch((e) => console.log("Audio play failed:", e));
        } catch (e) {
          console.log("Audio creation failed:", e);
        }
      };

      notification.onerror = (error) => {
        console.error("Notification error:", error);
      };

      // Fallback: Also show an alert for localhost testing
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.log("Showing alert as fallback for localhost");
        setTimeout(() => {
          alert(`${title}\n${body}`);
        }, 100);
      }
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  } else {
    console.log(
      "Notification permission not granted. Current status:",
      Notification.permission
    );

    // Show alert fallback for localhost when permission is not granted
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      console.log("Showing alert as fallback for localhost (no permission)");
      setTimeout(() => {
        alert(`${title}\n${body}`);
      }, 100);
    }
  }
};

const CountdownTimer = ({
  eventEndTime,
  onEventConcluded,
}: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const notificationsSentRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Request notification permission when component mounts
    requestNotificationPermission();

    const checkEventStatus = () => {
      const currentTime = new Date();
      const timeDiff = eventEndTime.getTime() - currentTime.getTime();

      if (timeDiff <= 0) {
        setTimeRemaining("");
        onEventConcluded();
      } else {
        // Calculate time remaining
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        console.log("seconds", seconds);
        console.log("notificationsSent", notificationsSentRef.current);

        // Send notifications at specific thresholds
        if (
          seconds <= 30 &&
          seconds > 0 &&
          !notificationsSentRef.current.has(30)
        ) {
          console.log("Sending 30 second notification");
          sendNotification(
            "Event Ending Soon!",
            `Event will end in ${seconds} seconds.`
          );
          notificationsSentRef.current.add(30);
        } else if (
          seconds <= 60 &&
          seconds > 30 &&
          !notificationsSentRef.current.has(60)
        ) {
          console.log("Sending 1 minute notification");
          sendNotification("Event Ending Soon!", `Event will end in 1 minute.`);
          notificationsSentRef.current.add(60);
        } else if (
          minutes <= 5 &&
          minutes > 0 &&
          !notificationsSentRef.current.has(minutes)
        ) {
          console.log(`Sending ${minutes} minute notification`);
          sendNotification(
            "Event Ending Soon!",
            `Event will end in ${minutes} minutes.`
          );
          notificationsSentRef.current.add(minutes);
        }

        let timeString = "";
        if (days > 0) {
          timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (hours > 0) {
          timeString = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          timeString = `${minutes}m ${seconds}s`;
        } else {
          timeString = `${seconds}s`;
        }

        setTimeRemaining(timeString);
      }
    };

    // Check immediately
    checkEventStatus();

    // Check every second for countdown
    const interval = setInterval(checkEventStatus, 1000);

    return () => clearInterval(interval);
  }, [eventEndTime]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #dee2e6",
        maxWidth: "600px",
        margin: "20px auto 0 auto",
      }}
    >
      <p
        style={{
          margin: "0",
          fontSize: "16px",
          color: "#333",
          fontWeight: "500",
        }}
      >
        Event ends in:{" "}
        <span style={{ color: "#dc3545", fontWeight: "bold" }}>
          {timeRemaining}
        </span>
      </p>
      <p
        style={{
          margin: "5px 0 0 0",
          fontSize: "14px",
          color: "#555",
        }}
      >
        Event will conclude on {eventEndTime.toLocaleString()}
      </p>
      <button
        onClick={() => {
          console.log("Test notification button clicked");
          sendNotification("Test Notification", "This is a test notification");
        }}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          fontSize: "12px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Test Notification
      </button>
    </div>
  );
};

export default CountdownTimer;

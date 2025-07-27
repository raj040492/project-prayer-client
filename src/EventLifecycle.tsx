import { useState, useEffect } from "react";
import App from "./App";
import CountdownTimer from "./CountdownTimer";
import Navbar from "./Navbar";
import RegistrationModal from "./RegistrationModal";

// Helper function to format time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Simple countdown component for start timer
const StartCountdown = ({ eventStartTime }: { eventStartTime: Date }) => {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const currentTime = new Date();
      const timeDiff = eventStartTime.getTime() - currentTime.getTime();

      if (timeDiff <= 0) {
        setTimeRemaining("");
      } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

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

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [eventStartTime]);

  return <span>{timeRemaining}</span>;
};

interface EventLifecycleProps {
  eventStartTime: Date;
  eventEndTime: Date;
}

type EventStatus = "pending" | "live" | "concluded";

const EventLifecycle = ({
  eventStartTime,
  eventEndTime,
}: EventLifecycleProps) => {
  const [eventStatus, setEventStatus] = useState<EventStatus>("pending");
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  useEffect(() => {
    const checkEventStatus = () => {
      const currentTime = new Date();
      const startTimeDiff = eventStartTime.getTime() - currentTime.getTime();
      const endTimeDiff = eventEndTime.getTime() - currentTime.getTime();

      if (endTimeDiff <= 0) {
        setEventStatus("concluded");
      } else if (startTimeDiff <= 0) {
        setEventStatus("live");
      } else {
        setEventStatus("pending");
      }
    };

    // Check immediately
    checkEventStatus();

    // Check every second for status updates
    const interval = setInterval(checkEventStatus, 1000);

    return () => clearInterval(interval);
  }, [eventStartTime, eventEndTime]);

  // Event concluded - show conclusion message
  if (eventStatus === "concluded") {
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            textAlign: "center",
            padding: "20px",
            marginTop: "80px",
          }}
        >
          <div>
            <h2 style={{ color: "#dc3545", marginBottom: "20px" }}>
              Event Concluded
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#333",
                maxWidth: "500px",
                lineHeight: "1.6",
              }}
            >
              The Live streaming event that you are trying to access has been
              concluded.
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#666",
                marginTop: "20px",
              }}
            >
              Event ended on: {eventEndTime.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Event pending - show start countdown
  if (eventStatus === "pending") {
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            textAlign: "center",
            padding: "20px",
            marginTop: "80px",
          }}
        >
          <div>
            <h2 style={{ color: "#007bff", marginBottom: "20px" }}>
              Event Starting Soon
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#333",
                maxWidth: "500px",
                lineHeight: "1.6",
                marginBottom: "30px",
              }}
            >
              The live streaming event will begin shortly. Please wait while we
              prepare the stream.
            </p>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#e3f2fd",
                borderRadius: "8px",
                border: "1px solid #2196f3",
                maxWidth: "400px",
                margin: "0 auto",
                marginBottom: "30px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  color: "#1976d2",
                  fontWeight: "500",
                }}
              >
                Event starts in:{" "}
                <span style={{ color: "#007bff", fontWeight: "bold" }}>
                  <StartCountdown eventStartTime={eventStartTime} />
                </span>
              </p>
              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: "14px",
                  color: "#555",
                }}
              >
                Event will begin on {eventStartTime.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setIsRegistrationModalOpen(true)}
              style={{
                padding: "15px 40px",
                fontSize: "1.1rem",
                backgroundColor: "#8B4513",
                color: "white",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 6px 20px rgba(139,69,19,0.3)",
                transition: "all 0.3s",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginTop: "20px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#A0522D";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(139,69,19,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#8B4513";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(139,69,19,0.3)";
              }}
            >
              Register
            </button>
          </div>
        </div>
        <RegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          eventStartTime={eventStartTime}
          eventEndTime={eventEndTime}
          onRegister={(startTime, endTime, duration, amount) => {
            console.log(
              `Registration: ${formatTime(startTime)} to ${formatTime(
                endTime
              )} (${duration} minutes) for ₹${amount}`
            );
            // TODO: Implement actual payment processing
            alert(
              `Payment processing for ${formatTime(startTime)} to ${formatTime(
                endTime
              )} (${duration} minutes) - ₹${amount} - Coming soon!`
            );
            setIsRegistrationModalOpen(false);
          }}
        />
      </div>
    );
  }

  // Event live - show video player with end countdown
  return (
    <div>
      <Navbar />
      <App />
      <CountdownTimer
        eventEndTime={eventEndTime}
        onEventConcluded={() => setEventStatus("concluded")}
      />
    </div>
  );
};

export default EventLifecycle;

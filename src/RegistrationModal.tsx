import { useState } from "react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (
    startTime: Date,
    endTime: Date,
    duration: number,
    amount: number
  ) => void;
  eventStartTime: Date;
  eventEndTime: Date;
}

const RegistrationModal = ({
  isOpen,
  onClose,
  onRegister,
  eventStartTime,
  eventEndTime,
}: RegistrationModalProps) => {
  const [selectedStartTime, setSelectedStartTime] =
    useState<Date>(eventStartTime);
  const [selectedEndTime, setSelectedEndTime] = useState<Date>(
    new Date(eventStartTime.getTime() + 30 * 60 * 1000)
  ); // Default 30 minutes

  if (!isOpen) return null;

  // Generate time options for the event duration
  const generateTimeOptions = () => {
    const options = [];
    const currentTime = new Date(eventStartTime);
    const endTime = new Date(eventEndTime);

    while (currentTime <= endTime) {
      options.push(new Date(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + 30); // 30-minute intervals
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  // Calculate duration in minutes
  const durationMinutes = Math.round(
    (selectedEndTime.getTime() - selectedStartTime.getTime()) / (1000 * 60)
  );

  // Calculate amount based on duration (50 INR per 30 minutes)
  const amount = Math.ceil(durationMinutes / 30) * 50;

  // Get valid end time options for the selected start time
  const validEndTimeOptions = timeOptions.filter(
    (time) => time > selectedStartTime
  );

  // Check if the selection is valid
  const isValidSelection =
    selectedEndTime > selectedStartTime &&
    durationMinutes >= 30 &&
    validEndTimeOptions.length > 0 &&
    validEndTimeOptions.some(
      (time) => time.getTime() === selectedEndTime.getTime()
    );

  const handleRegister = () => {
    onRegister(selectedStartTime, selectedEndTime, durationMinutes, amount);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`.trim();
    }
    return `${mins}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <h2
            style={{
              color: "#8B4513",
              marginBottom: "10px",
              fontSize: "1.8rem",
            }}
          >
            Register for Sacred Service
          </h2>
          <p style={{ color: "#666", fontSize: "1rem" }}>
            Choose your viewing duration and complete registration
          </p>
        </div>

        {/* Event Information */}
        <div
          style={{
            marginBottom: "25px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          <h3
            style={{
              margin: "0 0 10px 0",
              color: "#8B4513",
              fontSize: "1.1rem",
            }}
          >
            Event Schedule
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.9rem",
              color: "#666",
            }}
          >
            <span>
              Start: {formatDate(eventStartTime)} at{" "}
              {formatTime(eventStartTime)}
            </span>
            <span>
              End: {formatDate(eventEndTime)} at {formatTime(eventEndTime)}
            </span>
          </div>
        </div>

        {/* Time Selection */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "500",
              color: "#333",
            }}
          >
            Select Your Viewing Time:
          </label>

          {/* Start Time */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              Start Time:
            </label>
            <select
              value={selectedStartTime.toISOString()}
              onChange={(e) => {
                const newStartTime = new Date(e.target.value);
                setSelectedStartTime(newStartTime);

                // Get valid end time options for the new start time
                const validEndOptions = timeOptions.filter(
                  (time) => time > newStartTime
                );

                // If current end time is invalid or no valid options exist, set to first valid option
                if (validEndOptions.length > 0) {
                  if (
                    selectedEndTime <= newStartTime ||
                    !validEndOptions.some(
                      (time) => time.getTime() === selectedEndTime.getTime()
                    )
                  ) {
                    setSelectedEndTime(validEndOptions[0]);
                  }
                } else {
                  // No valid end time options, set to a default (this will make the selection invalid)
                  setSelectedEndTime(
                    new Date(newStartTime.getTime() + 30 * 60 * 1000)
                  );
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "1rem",
                backgroundColor: "white",
              }}
            >
              {timeOptions.map((time) => (
                <option key={time.toISOString()} value={time.toISOString()}>
                  {formatTime(time)} - {formatDate(time)}
                </option>
              ))}
            </select>
          </div>

          {/* End Time */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              End Time:
            </label>
            <select
              value={selectedEndTime.toISOString()}
              onChange={(e) => setSelectedEndTime(new Date(e.target.value))}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "1rem",
                backgroundColor: "white",
              }}
            >
              {timeOptions
                .filter((time) => time > selectedStartTime)
                .map((time) => (
                  <option key={time.toISOString()} value={time.toISOString()}>
                    {formatTime(time)} - {formatDate(time)}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Pricing Information */}
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "25px",
            border: "1px solid #e9ecef",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ color: "#666" }}>Duration:</span>
            <span style={{ fontWeight: "600", color: "#333" }}>
              {formatDuration(durationMinutes)}
            </span>
          </div>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #dee2e6",
              margin: "15px 0",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontWeight: "600", color: "#333", fontSize: "1.1rem" }}
            >
              Total Amount:
            </span>
            <span
              style={{
                fontWeight: "700",
                color: "#8B4513",
                fontSize: "1.3rem",
              }}
            >
              ₹{amount}
            </span>
          </div>
        </div>

        {/* Validation Message */}
        {!isValidSelection && (
          <div
            style={{
              marginBottom: "20px",
              padding: "10px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "6px",
              fontSize: "0.9rem",
              color: "#856404",
            }}
          >
            ⚠️ Please select a valid time range. End time must be at least 30
            minutes after start time.
          </div>
        )}

        {/* Terms and Conditions */}
        <div
          style={{ marginBottom: "25px", fontSize: "0.9rem", color: "#666" }}
        >
          <p style={{ marginBottom: "10px" }}>
            By registering, you agree to our terms of service and privacy
            policy.
          </p>
          <p>Payment will be processed securely through our payment gateway.</p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              fontSize: "1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#545b62";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#6c757d";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleRegister}
            disabled={!isValidSelection}
            style={{
              padding: "12px 30px",
              fontSize: "1rem",
              backgroundColor: isValidSelection ? "#8B4513" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: isValidSelection ? "pointer" : "not-allowed",
              fontWeight: "600",
              transition: "all 0.2s",
              opacity: isValidSelection ? 1 : 0.6,
            }}
            onMouseOver={(e) => {
              if (isValidSelection) {
                e.currentTarget.style.backgroundColor = "#A0522D";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseOut={(e) => {
              if (isValidSelection) {
                e.currentTarget.style.backgroundColor = "#8B4513";
                e.currentTarget.style.transform = "translateY(0)";
              }
            }}
          >
            {isValidSelection ? `Pay ₹${amount}` : "Invalid Selection"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;

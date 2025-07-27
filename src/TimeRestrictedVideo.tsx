import EventLifecycle from "./EventLifecycle";

const TimeRestrictedVideo = () => {
  // Configure the event start and end times
  // July 19, 2025, 10:25 AM (start time)
  const eventStartTime = new Date(2025, 6, 21, 21, 0, 0, 0);
  // July 19, 2025, 10:32 AM (end time)
  const eventEndTime = new Date(2025, 6, 21, 23, 0, 0, 0);

  return (
    <EventLifecycle
      eventStartTime={eventStartTime}
      eventEndTime={eventEndTime}
    />
  );
};

export default TimeRestrictedVideo;

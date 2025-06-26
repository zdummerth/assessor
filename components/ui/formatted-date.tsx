const FormattedDate = ({
  date,
  className = "",
  showTime,
}: {
  date: string;
  className?: string;
  showTime?: boolean;
}) => {
  const localDate = new Date(date);
  const formattedDate = localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const formattedTime = localDate
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    })
    .replace(/\s?(am|pm)$/i, (match) => match.toUpperCase());

  return (
    <span className={className}>
      {formattedDate} {formattedTime && showTime ? formattedTime : ""}
    </span>
  );
};

export default FormattedDate;

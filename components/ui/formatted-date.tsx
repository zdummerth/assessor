const FormattedDate = ({
  date,
  className = "",
  month = "long",
  showTime,
}: {
  date: string;
  className?: string;
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  showTime?: boolean;
}) => {
  const localDate = new Date(date);
  const formattedDate = localDate.toLocaleDateString("en-US", {
    month,
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

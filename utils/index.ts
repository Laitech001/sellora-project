export const getOrdinal = (day: any) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

    const day = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      day: "numeric",
    });

    const monthYear = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      month: "long",
      year: "numeric",
    });

    const time = date.toLocaleString("en-NG", {
      timeZone: "Africa/Lagos",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${day}${getOrdinal(Number(day))} ${monthYear}, ${time}`;
}
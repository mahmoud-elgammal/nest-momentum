export const duration = (expire: string): number => {
  const regex = /^(\d+)([smh])$/; // Matches digits followed by 's', 'm', or 'h'

  const match = expire.match(regex);

  if (!match) {
    throw new Error(
      `Invalid expiration format. Use values like "5s", "10m", or "1h", But got ${expire}.`,
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    default:
      throw new Error(
        'Invalid time unit. Use "s" for seconds, "m" for minutes, or "h" for hours.',
      );
  }
};

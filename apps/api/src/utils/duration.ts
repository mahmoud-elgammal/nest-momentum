export const duration = (expire: string): number => {
  const regex = /^(\d+)([smhdM])$/; // Updated regex to include 'd' and 'M'

  const match = expire.match(regex);

  if (!match) {
    throw new Error(
      `Invalid expiration format. Use values like "5s", "10m", "1h", "7d", or "2M". But got ${expire}.`,
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
    case 'd':
      return value * 86400; // 1 day = 24 hours * 60 minutes * 60 seconds
    case 'M':
      // Approximating a month to 30 days for simplicity (adjust based on your needs)
      return value * 2592000; // 1 month = 30 days * 24 hours * 60 minutes * 60 seconds
    default:
      throw new Error(
        'Invalid time unit. Use "s" for seconds, "m" for minutes, "h" for hours, "d" for days, or "M" for months.',
      );
  }
};


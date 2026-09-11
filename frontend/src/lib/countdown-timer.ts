import React from "react";

export function useCountdown(expiresAt: string | null) {
  const [timeRemaining, setTimeRemaining] = React.useState(0);

  React.useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const remaining = Math.floor(
        (new Date(expiresAt).getTime() - new Date().getTime()) / 1000,
      );
      setTimeRemaining(Math.max(0, remaining));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeRemaining;
}

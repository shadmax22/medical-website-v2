import React from "react";
import {
  Alert,
} from "@material-tailwind/react";

type AlertColor = "blue" | "green" | "orange" | "red" | "gray";

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState<Record<AlertColor, boolean>>({
    blue: true,
    green: true,
    orange: true,
    red: true,
    gray: true,
  });
  const alerts: AlertColor[] = ["gray", "green", "orange", "red"];

  return (
    <div className="my-3 flex max-w-screen-lg flex-col gap-8">

      {alerts.map((color) => (
        <Alert
          key={color}
          open={showAlerts[color]}
          color={color}
          onClose={() => setShowAlerts((current) => ({ ...current, [color]: false }))}
        >
          A simple {color} alert with an <a href="#">example link</a>. Give
          it a click if you like.
        </Alert>
      ))}

    </div>
  );
}

export default Notifications;

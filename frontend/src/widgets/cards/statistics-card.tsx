import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import type { ReactNode } from "react";

interface StatisticsCardProps {
  color?: string;
  icon: ReactNode;
  title: ReactNode;
  value: ReactNode;
  footer?: ReactNode;
}

export function StatisticsCard({ 
  color = "blue", 
  icon, 
  title, 
  value, 
  footer 
}: StatisticsCardProps) {
  return (
    <Card className="border border-blue-gray-100 shadow-sm">
      <CardHeader
        variant="gradient"
        color={color as any}
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center"
      >
        {icon}
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 p-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.tsx";

export default StatisticsCard;

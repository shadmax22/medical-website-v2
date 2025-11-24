import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import type { ReactNode } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type ChartType = "area" | "line" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap";

interface StatisticsChartProps {
  color?: string;
  chart: {
    type: ChartType;
    height: number;
    series: Array<{ name: string; data: number[] }>;
    options: ApexOptions;
  };
  title: ReactNode;
  description: ReactNode;
  footer?: ReactNode;
}

export function StatisticsChart({ 
  color = "blue", 
  chart, 
  title, 
  description, 
  footer 
}: StatisticsChartProps) {
  return (
    <Card className="border border-blue-gray-100 shadow-sm">
      <CardHeader variant="gradient" color={color as any} floated={false} shadow={false}>
        <Chart {...chart} />
      </CardHeader>
      <CardBody className="px-6 pt-0">
        <Typography variant="h6" color="blue-gray">
          {title}
        </Typography>
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {description}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 px-6 py-5">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

StatisticsChart.displayName = "/src/widgets/charts/statistics-chart.tsx";

export default StatisticsChart;

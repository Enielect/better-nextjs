import React from "react";
import AreaChartWrapper from "./components/AreaChart";
import RadialchartWrapper from "./components/RadialChart";
import LongLineChart from "./components/LongLineChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import RadialCompareWrapper from "./components/RadialCompare";
import MultipleLineChart from "./components/MultipleLineChart";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SelectScrollable from "./components/SelectWeek";
import MultipleRadialChart from "./components/MultipleRadialChart";
import { formatAreaChartData, getWeekNumber } from "@/lib/helpers";
import {
  getBestPerformingWeek,
  getCompletedTasksInWeek,
  getWeekGroupTasks,
} from "@/server/db/queries/select";

const PerformancePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/login");
  const today = new Date();
  const currentWeekString = `${getWeekNumber(today)}-${today.getFullYear()}`;
  const lastWeekDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7,
  );
  const lastWeekString = `${getWeekNumber(lastWeekDate)}-${lastWeekDate.getFullYear()}`;
  const lastWeek = await getCompletedTasksInWeek(lastWeekString);
  const currentWeek = await getCompletedTasksInWeek(currentWeekString);
  const chartData = formatAreaChartData(currentWeek, undefined, lastWeek);

  const weekOfBestPerformance = await getBestPerformingWeek();  
  const bestWeek = await getCompletedTasksInWeek(weekOfBestPerformance);

  const currentWeekVsBestChart = formatAreaChartData(currentWeek, bestWeek);
  console.log(currentWeekVsBestChart, "currentWeekVsBestChart");

  console.log(chartData, "chartData");
  return (
    <div className="px-3">
      <div className="flex items-center justify-between">
        <h2 className="py-3 text-lg font-semibold">
          Performance Characterization
        </h2>
        <SelectScrollable />
      </div>
      <ScrollArea className="h-[calc(100dvh-8rem)] pr-4">
        <div className="grid grid-cols-[30%_30%_auto] gap-4">
          {/* comparting this week's completed task with last week */}
          <div className="col-span-full grid grid-cols-2 gap-4">
            <div>
              <MultipleLineChart chartData={chartData!} />
            </div>
            {/* comparting this week's completed task with our best week(in terms of completed tasks) */}
            <div>
              <AreaChartWrapper chartData={currentWeekVsBestChart!} />
            </div>
          </div>
          {/* comparing the number of tasks planned each day for the past 3 months */}
          <div className="col-span-full">
            <LongLineChart />
          </div>
          {/**you've planned 20 more tasks this weeek than last week */}
          <div>
            <RadialCompareWrapper />
          </div>

          {/**progress with completing set tasks for the current week(efficiency) */}
          <div>
            <RadialchartWrapper />
          </div>
          {/** you've planned 20 more taks this week than your best ever tally*/}
          <div>
            <RadialCompareWrapper />
          </div>
          <div>
            <MultipleRadialChart />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PerformancePage;

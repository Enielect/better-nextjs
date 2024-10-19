import React from "react";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SelectScrollable from "../components/SelectWeek";
import {
  formatAreaChartData,
  getPreviousWeek,
  getWeekNumber,
  taskDataPerDay,
  tasksCompletedThisWeekVsBestWeek,
  tasksCompletedThisWeekVsLastWeek,
} from "@/lib/helpers";
import {
  completedTasksPerDay,
  formatGroupsAccWeekNum,
  getBestPerformingWeek,
  getCompletedTasksInWeek,
  getWeekGroupTasks,
  statForCurrWeek,
} from "@/server/db/queries/select";
import RadialCompareChart from "../components/RadialCompareChart";
import PerformanceChartData from "../components/PerformanceChartData";

const WeekPerformancePage = async ({
  params,
}: {
  params: { weekYear: string };
}) => {
  const session = await auth();

  if (!session?.user) redirect("/login");
  const lastWeekString = getPreviousWeek(params.weekYear);
  const lastWeek = await getCompletedTasksInWeek(lastWeekString);
  const currentWeek = await getCompletedTasksInWeek(params.weekYear);
  const weekOfBestPerformance = await getBestPerformingWeek();
  const bestWeek = await getCompletedTasksInWeek(weekOfBestPerformance);
  const tasksToDay = await completedTasksPerDay();
  const statForLastWeek = await statForCurrWeek(lastWeekString);
  const statForThisWeek = await statForCurrWeek(params.weekYear);
  const statForBestWeek = await statForCurrWeek(weekOfBestPerformance);

  const [
    lastWeekData,
    thisWeekData,
    bestWeekData,
    tasksToDayData,
    statForLastWeekData,
    statForThisWeekData,
    statForBestWeekData,
  ] = await Promise.all([
    lastWeek,
    currentWeek,
    bestWeek,
    tasksToDay,
    statForLastWeek,
    statForThisWeek,
    statForBestWeek,
  ]);
  const chartData = formatAreaChartData(thisWeekData, undefined, lastWeekData);

  const currentWeekVsBestChart = formatAreaChartData(
    thisWeekData,
    bestWeekData,
  );
  console.log(currentWeekVsBestChart, "currentWeekVsBestChart");

  const tasksPerDayChart = taskDataPerDay(tasksToDayData);

  const thisWeekVsLastWeekChart = tasksCompletedThisWeekVsLastWeek(
    statForThisWeekData.totalTasksCompleted ?? 0,
    statForLastWeekData.totalTasksCompleted ?? 0,
  );

  const thisWeekEfficiency =
    statForThisWeekData.totalTasksCompleted /
    statForThisWeekData.totalTasksCreated;

  const thisWeekVsBestWeekChart = tasksCompletedThisWeekVsBestWeek(
    statForThisWeekData.totalTasksCompleted ?? 0,
    statForBestWeekData.totalTasksCompleted ?? 0,
  );
  return (
    <PerformanceChartData
      chartData={chartData}
      currentWeekVsBestChart={currentWeekVsBestChart}
      tasksPerDayChart={tasksPerDayChart}
      thisWeekVsLastWeekChart={thisWeekVsLastWeekChart}
      thisWeekVsBestWeekChart={thisWeekVsBestWeekChart}
      thisWeekEfficiency={thisWeekEfficiency}
    />
  );
};

export default WeekPerformancePage;

import React from "react";
import AreaChartWrapper from "./components/AreaChart";
import RadialchartWrapper from "./components/RadialChart";
import LongLineChart from "./components/LongLineChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import RadialCompareWrapper from "./components/RadialCompare";
import MultipleLineChart from "./components/MultipleLineChart";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const PerformancePage = async () => {
  const session = await auth();

  if (!session?.user) redirect("/login");
  return (
    <div className="px-3">
      <h2 className="py-2 text-lg font-semibold">
        Performance Characterization
      </h2>
      <ScrollArea className="h-[calc(100dvh-8rem)] pr-4">
        <div className="grid grid-cols-[30%_30%_auto] gap-4">
          {/* comparting this week's completed task with last week */}
          <div className="col-span-full grid grid-cols-2 gap-4">
            <div>
              <MultipleLineChart />
            </div>
            {/* comparting this week's completed task with our best week(in terms of completed tasks) */}
            <div>
              <AreaChartWrapper />
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
        </div>
      </ScrollArea>
    </div>
  );
};

export default PerformancePage;
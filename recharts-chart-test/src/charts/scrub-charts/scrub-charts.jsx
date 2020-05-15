import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import tubing from "../../data/tubing.json";
import casing from "../../data/casing.json";
import moment from "moment";
import first from "lodash/first";
import last from "lodash/last";
import round from "lodash/round";
import {ticksForDomain} from "../../utils/ticks-from-domain";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: [[48, 0, 24, 0]],
    paddingTop: 8,
    borderTop: "1px solid grey",
  },

  chart: {
    display: "grid",
    gridTemplateColumns: "120px minmax(0,1fr)",
    gridAutoFlow: "column",
  },
}));

const scrubChartXAxis = (domain, ticks) => (
  <XAxis
    domain={domain}
    scale="time"
    type="number"
    dataKey={"date"}
    tickFormatter={(date) => {
      const m = moment(date).utc();
      return m.format("MM/DD");
    }}
    ticks={ticks}
  />
);

const scrubChartTooltip = () => (
  <Tooltip
    formatter={(value, name, props) => round(value, 1)}
    labelFormatter={(label) => moment(label).utc().format("MM/DD HH:mm")}
    isAnimationActive={false}
    // content={() => null}
  />
);

const ScrubCharts = () => {
  const classes = useStyles();

  // Map the data into a series. My date is using timestamps like 2020-04-30T14:55:00.000Z.
  // I'm finding recharts plots time best as unix timestamps.
  // Moment's valueOf method returns a unix timestamp in milliseconds.
  const tubingSeries = tubing.map((d) => ({
    ...d,
    date: moment(d.date).valueOf(),
  }));

  const casingSeries = casing.map((d) => ({
    ...d,
    date: moment(d.date).valueOf(),
  }));

  const domain = [first(tubingSeries).date, last(tubingSeries).date];
  const ticks = ticksForDomain(domain, "days");

  return (
    <div>
      <div className={classes.title}>
        Two charts using Rechart's Tooltip component, synchronized using the
        SyncId feature of the charts
      </div>
      <div className={classes.chart}>
        <div>Tubing</div>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart
            syncId="pressure"
            margin={{top: 10, right: 100, bottom: 0, left: 10}}
          >
            <Line data={tubingSeries} dataKey={"tubing"} dot={false} />
            {/*
            Similar to React-Vis, wrapping this in a real component instantiated with JSX does NOT work. 
            But at least we can use a function that returns a composable element for the chart. 
            Should allow us to have some common wrappers around reusable things like a time axis */}
            {scrubChartXAxis(domain, ticks)}
            <YAxis />
            {scrubChartTooltip()}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={classes.chart}>
        <div>Casing</div>

        <ResponsiveContainer width="100%" height={100}>
          <LineChart
            syncId="pressure"
            margin={{top: 10, right: 100, bottom: 0, left: 10}}
          >
            <Line data={casingSeries} dataKey={"casing"} dot={false} />
            {scrubChartXAxis(domain, ticks)}
            <YAxis />
            {scrubChartTooltip()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScrubCharts;

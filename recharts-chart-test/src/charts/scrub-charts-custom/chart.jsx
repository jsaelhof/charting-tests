import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {ResponsiveContainer, LineChart, Line, YAxis, XAxis} from "recharts";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
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

const Chart = ({data, xDomain, xTicks, dataKey, title}) => {
  const classes = useStyles();

  // Map the data into a series. My date is using timestamps like 2020-04-30T14:55:00.000Z.
  // I'm finding recharts plots time best as unix timestamps.
  // Moment's valueOf method returns a unix timestamp in milliseconds.
  const series = data.map((d) => ({
    ...d,
    date: moment(d.date).valueOf(),
  }));

  return (
    <div className={classes.chart}>
      <div>{title}</div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart margin={{top: 10, right: 100, bottom: 0, left: 10}}>
          <Line data={series} dataKey={dataKey} dot={false} />
          {/*
      Similar to React-Vis, wrapping this in a real component instantiated with JSX does NOT work. 
      But at least we can use a function that returns a composable element for the chart. 
      Should allow us to have some common wrappers around reusable things like a time axis */}
          {scrubChartXAxis(xDomain, xTicks)}
          <YAxis domain={["dataMin - 10", "dataMax + 10"]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(Chart);

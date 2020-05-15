import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import moment from "moment";
import {SizeMe} from "react-sizeme";
import {
  VictoryLine,
  VictoryChart,
  VictoryContainer,
  VictoryAxis,
} from "victory";
import customTheme from "../../themes/custom-theme.json";

const useStyles = makeStyles((theme) => ({
  chart: {
    display: "grid",
    gridTemplateColumns: "120px minmax(0,1fr)",
    gridAutoFlow: "column",
  },
}));

const scrubChartXAxis = (domain, ticks) => (
  <VictoryAxis
    domain={domain}
    scale="time"
    dataKey={"date"}
    tickFormat={(date) => {
      const m = moment(date).utc();
      return m.format("MM/DD");
    }}
    tickValues={ticks}
  />
);

const Chart = ({data, xDomain, xTicks, dataKey, title}) => {
  const classes = useStyles();

  // Map the data into a series. My date is using timestamps like 2020-04-30T14:55:00.000Z.
  // I'm finding recharts plots time best as unix timestamps.
  // Moment's valueOf method returns a unix timestamp in milliseconds.
  const series = data.map((d) => ({
    ...d,
    date: new Date(d.date),
  }));

  return (
    <div className={classes.chart}>
      <div>{title}</div>
      <SizeMe>
        {({size}) => {
          return (
            <div>
              <VictoryChart
                width={size.width}
                height={100}
                theme={customTheme}
                containerComponent={<VictoryContainer responsive={false} />}
                padding={{left: 60, bottom: 30, right: 100, top: 10}}
              >
                <VictoryLine
                  data={series}
                  x={"date"}
                  y={dataKey}
                  scale={{x: "time"}}
                  domain={{y: [0, Math.max(...series.map((d) => d.y))]}}
                  animate={{
                    duration: 400,
                  }}
                />

                {/*
                  Similar to React-Vis, wrapping this in a real component instantiated with JSX does NOT work. 
                  But at least we can use a function that returns a composable element for the chart. 
                  Should allow us to have some common wrappers around reusable things like a time axis 
                */}
                {scrubChartXAxis(xDomain, xTicks)}

                <VictoryAxis
                  dependentAxis
                  // Without specifying the values, Victory (really D3 underneath) is only returning [100,200,300].
                  // In a real scenario I'd calculate this instead of hardcoding.
                  tickValues={[0, 100, 200, 300, 400]}
                />
              </VictoryChart>
            </div>
          );
        }}
      </SizeMe>
    </div>
  );
};

export default React.memo(Chart);

import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  Scatter,
  YAxis,
} from "recharts";
import cycles from "../../data/cycles.json";
import moment from "moment";
import {plungerCycleArrival} from "../../constants/plunger-cycle-arrival";
import last from "lodash/last";
import first from "lodash/first";
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

const CyclesChart = () => {
  const classes = useStyles();

  const series = cycles.map((cycle) => ({
    ...cycle,
    date: moment(cycle.date).valueOf(),
    endDate: moment(cycle.endDate).valueOf(),
  }));

  console.log(series);

  const [cycleFocus, setCycleFocus] = useState(null);

  // Define the full domain. I'm using the extent of the data which I know is sorted by date.
  // Recharts has some cool ways of doing domains like ["dataMin","dataMax"] which figures out the
  // extent interally but I need to know the dates here so I can work with them to figure out the ticks I want.
  const domain = [first(series).date, last(series).endDate];
  const ticks = ticksForDomain(domain, "days");

  const Cycle = ({date, endDate, y, cx, cy, xAxis, yAxis, cycle, ...props}) => {
    const x = xAxis.scale(date);
    const x2 = xAxis.scale(endDate);
    const hovered = cycleFocus === date;
    const userIsHovering = cycleFocus !== null;

    return (
      <rect
        x={x}
        y={yAxis.y}
        width={x2 - x}
        height={cy - yAxis.y}
        fill={plungerCycleArrival[cycle.arrival.category]}
        opacity={userIsHovering && !hovered ? 0.4 : 1}
        stroke={"rgba(0,0,0,0.5)"}
      />
    );
  };

  return (
    <div>
      <div className={classes.title}>
        Scatter Plot with custom mark components that have a duration on the
        X-axis (Uses XAxis scale function provided by Recharts)
      </div>
      <div className={classes.chart}>
        <div>Cycles</div>
        <ResponsiveContainer width="100%" height={100}>
          <ScatterChart
            margin={{top: 0, right: 100, bottom: 0, left: 10}}
            // Have to use onMouseLeave on the chart and onMouseOver on the scatter elements.
            // If we use onMouseOut on the chart or the scatter elements it causes an extra render
            // when moving from one cycle to the next causing a flash.
            onMouseLeave={(e) => setCycleFocus(null)}
          >
            <Scatter
              data={series}
              dataKey={"y"}
              shape={<Cycle />}
              onMouseOver={(e) => setCycleFocus(e.date)}
            />

            <XAxis
              // The domain of the data to display.
              // Recharts provides some cool options for this over React-Vis but ultimately I needed to
              // know the dates for calculating ticks.
              domain={domain}
              // Helps Recharts know we are plotting time.
              // When setting time you must set type="number" and provide a domain.
              scale="time"
              // Required when using scale="time"
              type="number"
              // The key in each data object to use as the X value.
              // This can be a string label or it can be a function that transforms the data.
              // (for example, this could transfrom the unix timestamp to a moment object)
              dataKey={"date"}
              // Manually define which ticks to use.
              // Recharts can auto generate ticks but i'm finding that the can be a bit weird in a time-series.
              // They can appear spaced unevenly.
              // Here i'm taking control by using the domain of the data to generate ticks where I think they would be best.
              ticks={ticks}
              // Format the tick value. "date" is a unix timestamp here.
              tickFormatter={(date) => {
                const m = moment(date).utc();
                return m.format("MM/DD");
              }}
              // Length of the tick line in pixels. 0 hides them. The ticks are being hidden during the animated zoom in/out transition.
              //tickSize={showTicks ? 10 : 0}
              // How far to draw the tick labels from the tick lines
              //tickMargin={5}
              // Some simple tick styling using a configuration object
              // tick={{
              //   fill: "rgba(0,0,0,0.6)",
              //   textAnchor: "start",
              //   fontSize: "0.7em",
              // }}
              // This helps trim the series so they don't draw outside the axes
              allowDataOverflow={true}
              // Recharts figures out which ticks to show by default.
              // When you give it your own ticks like we are, it will still remove some of them by default if
              // the width of a tick crashes into it's neighbor. When it does this you can wind up with
              // uneven ticks due to somee ticks beeing wider than others (depending on the width of the measured text).
              // This value sets a minimum tick width. By using 20 here, which is wider than any of my ticks, it helps to make
              // sure that the ticks measure at a consistent size and maintian even spacing.
              // Another option is to use interval={0} which tells Recharts to use all of the provided ticks regardless of
              // whether they crash into each other or not. If I was using that, I would make sure my tick generator did its
              // own work to ensure ticks were not too close together.
              //minTickGap={20}
            />

            <YAxis tickSize={0} tickFormatter={() => ""} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CyclesChart;

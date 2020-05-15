import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import cycles from "../../data/cycles.json";
import moment from "moment";
import {plungerCycleArrival} from "../../constants/plunger-cycle-arrival";
import last from "lodash/last";
import first from "lodash/first";
import {ticksForDomain} from "../../utils/ticks-from-domain";
import {
  VictoryScatter,
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
} from "victory";
import {SizeMe} from "react-sizeme";
import customTheme from "../../themes/custom-theme.json";

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
    date: new Date(cycle.date),
    endDate: new Date(cycle.endDate),
  }));

  const [cycleFocus, setCycleFocus] = useState(null);

  // Define the full domain. I'm using the extent of the data which I know is sorted by date.
  // Recharts has some cool ways of doing domains like ["dataMin","dataMax"] which figures out the
  // extent interally but I need to know the dates here so I can work with them to figure out the ticks I want.
  const domain = [first(series).date, last(series).endDate];
  const ticks = ticksForDomain(domain, "days");

  const Cycle = ({y, datum, scale}) => {
    // Get the x points using the provide axis scale functions.
    const x1 = scale.x(datum.date);
    const x2 = scale.x(datum.endDate);
    const hovered = cycleFocus === datum.date.getTime();
    const userIsHovering = cycleFocus !== null;

    return (
      <rect
        x={x1}
        y={0}
        width={x2 - x1} // Width of the mark in the X.
        height={y}
        fill={plungerCycleArrival[datum.cycle.arrival.category]}
        opacity={userIsHovering && !hovered ? 0.4 : 1}
        stroke={"rgba(0,0,0,0.5)"}
        datum={datum}
        // Putting event handlers on charts in Victory is super cryptic.
        // It looks like they've built a really customizable system but at the cost of increased complexity.
        // They may not work here because i'm suing a custom component and drawing a duration-based mark.
        // At any rate, put the handlers here works just as I need it to.
        onMouseOver={() => {
          setCycleFocus(datum.date.getTime());
        }}
        onMouseOut={() => {
          setCycleFocus(null);
        }}
      />
    );
  };

  return (
    <div>
      <div className={classes.title}>
        Scatter Plot with custom mark components that have a duration on the
        X-axis (Uses x scale function provided by Victory Charts)
      </div>
      <div className={classes.chart}>
        <div>Cycles</div>
        <SizeMe>
          {({size}) => {
            return (
              <div>
                <VictoryChart
                  width={size.width}
                  height={100}
                  theme={customTheme}
                  containerComponent={<VictoryContainer responsive={false} />}
                  padding={{left: 60, bottom: 30, right: 100, top: 0}}
                >
                  <VictoryScatter
                    data={series}
                    // The key in each data object to use as the X value.
                    // This can be a string of the key, a pathed string (ex employee.name) or it can be a function that transforms the data.
                    // (for example, this could transfrom the unix timestamp to a moment object)
                    x={"date"}
                    // Same as the X
                    y={"y"}
                    // Custom component for each scatter mark.
                    // In this case it will draw the recatnagle that represents the cycle.
                    dataComponent={<Cycle />}
                    // Helps Victory know we are plotting time.
                    // Need to speicfy an {x,y} object
                    scale={{x: "time"}}
                    // The domain of the data to display.
                    // Need to specify in an {x, y} object otherwise Victory uses then same domain for both.
                    domain={{x: domain}}
                  />

                  {/* 
                    The X-Axis
                    Unlike other libs, Victory doesn't specifically make an axis X or Y.
                    You have specify if it's the "dependent" axis (Y) or not, which is the default.
                  */}
                  <VictoryAxis
                    // Manually define which ticks to use.
                    // Here i'm taking control by using the domain of the data to generate ticks where I think they would be best.
                    tickValues={ticks}
                    // Format the tick value. "date" is a unix timestamp here.
                    tickFormat={(date) => {
                      const m = moment(date).utc();
                      return m.format("MM/DD");
                    }}
                    // Need to specify time here as well as in the VictoryScatter component
                    scale={"time"}
                    // Style the ticks.
                    // This is essentially applying a partial theme element.
                    // Most other libraries provide some of these basica things as first-class props.
                    // This made figuring out how to do this a bit more challenging.
                    style={{
                      ticks: {
                        size: 5,
                      },
                    }}
                  />

                  {/* 
                    The Y-Axis
                    Unlike other libs, Victory doesn't specifically make an axis X or Y.
                    You have specify if it's the "dependent" axis (Y) or not, which is the default.
                  */}
                  <VictoryAxis
                    dependentAxis
                    // Hide the ticks...by formatting and styling them to blank.
                    // There might be a better way to do this but i didn't find it.
                    tickFormat={() => ""}
                    style={{
                      ticks: {
                        size: 0,
                      },
                    }}
                  />
                </VictoryChart>
              </div>
            );
          }}
        </SizeMe>
      </div>
    </div>
  );
};

export default CyclesChart;

import React, {useState, useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import simple from "../../data/simple.json";
import moment from "moment";
import first from "lodash/first";
import last from "lodash/last";
import {ticksForDomain} from "../../utils/ticks-from-domain";
import Chart from "./chart";
import Brush from "./brush";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: [[48, 0, 24, 0]],
    paddingTop: 8,
    borderTop: "1px solid grey",
  },

  grid: {
    display: "grid",
    gridRowGap: 16,
    gridTemplateColumns: "1fr",
  },

  row2: {
    gridColumn: 1,
    gridRow: 2,
  },

  row3: {
    gridColumn: 1,
    gridRow: 3,
  },

  brush: {
    gridColumn: 1,
    gridRow: "2 / 4",
    zIndex: 1,
  },
}));

const ScrubChartsCursor = () => {
  const classes = useStyles();

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!chartData) {
      const xDomain = [
        moment(first(simple).date).valueOf(),
        moment(last(simple).date).valueOf(),
      ];
      const xTicks = ticksForDomain(xDomain, "days");

      setChartData({
        xDomain,
        xTicks,
      });
    }
  }, [chartData]);

  if (!chartData) return null;

  return (
    <div className={classes.grid}>
      <div className={classes.title}>
        Cursor: Two charts using a third chart overlaid to create a unified
        tooltip through the underlying charts
        <div style={{fontSize: 10, marginTop: 16}}>
          This is done using Victory's Cursor Container which creates a
          crosshair/tooltip to move through the data, interpolating between the
          points. In this example, I'm using an invisible line series with a
          data point for each day (Apr 23, Apr 24 etc). The crosshair is
          restricted to the X dimension.
        </div>
        <div style={{fontSize: 10, marginTop: 16}}>
          In this example, the light grey line is the cursor and it shows the
          interpolated date between any two given points. What I really wanted
          is a cursor that snaps to the closest true data point (no
          interpolation) so I have done that by using the onCursorChange event
          to get the interpolated point and see if it is before or after noon to
          determine which point it is closer to. I am drawing the red line based
          on that closest data point. In a real implementation the grey cursor
          line and date would be hidden.
        </div>
        <div style={{fontSize: 10, marginTop: 16}}>
          This is manual and requires logic based on the knowledge of the data
          and is extra work compared to React-Vis's onNearestX. It is more
          accurate and reliable than Victory's Voronoi Container above which is
          designed to provide a "nearest X/Y" value.
        </div>
      </div>

      <div className={classes.row2}>
        <Chart
          data={simple}
          dataKey="y"
          title="Tubing"
          xDomain={chartData.xDomain}
          xTicks={chartData.xTicks}
        />
      </div>

      <div className={classes.row3}>
        <Chart
          data={simple}
          dataKey="y"
          title="Casing"
          xDomain={chartData.xDomain}
          xTicks={chartData.xTicks}
        />
      </div>

      <div className={classes.brush}>
        <Brush xDomain={chartData.xDomain} xTicks={chartData.xTicks} />
      </div>
    </div>
  );
};

export default ScrubChartsCursor;

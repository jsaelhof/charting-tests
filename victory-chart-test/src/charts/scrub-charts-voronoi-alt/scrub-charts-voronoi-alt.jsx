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

  button: {
    width: 150,
    height: 24,
    backgroundColor: "green",
    borderRadius: 4,
    margin: 5,
    marginTop: 16,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(0,0,0,0.4)",
    fontSize: 14,
    color: "white",
    cursor: "pointer",
  },
}));

const ScrubChartsVoronoiAlt = () => {
  const classes = useStyles();

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const xDomain = [
      moment(first(simple).date).valueOf(),
      moment(last(simple).date).valueOf(),
    ];
    const xTicks = ticksForDomain(xDomain, "days");

    setChartData({
      xDomain,
      xTicks,
    });
  }, []);

  if (!chartData) return null;

  return (
    <div className={classes.grid}>
      <div className={classes.title}>
        Voronoi Alternate: Two charts using a third chart overlaid to create a
        unified tooltip through the underlying charts.
        <div style={{fontSize: 10, marginTop: 16}}>
          This is done using Victory's Voronoi SERIES instead of the container.
          I then use the mouse over on the series and it works without the 04/25
          issue. It has a different issue though...it requires a hardcoded
          height for the Voronoi series. In the one above i used SizeMe to calc
          the height. If I do that here, it causes the chart to grow by a pixel
          on each render causing an infinite loop of re-renders and a
          perpetually growing graph height.
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

export default ScrubChartsVoronoiAlt;

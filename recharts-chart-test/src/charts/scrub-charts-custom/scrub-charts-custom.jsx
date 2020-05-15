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

const ScrubChartsCustom = () => {
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
        Two charts using a thrid chart overlaid to create a unified toooltip
        through the underlying charts
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
        <Brush
          xDomain={chartData.xDomain}
          yDomain={[0, 1]}
          xTicks={chartData.xTicks}
        />
      </div>
    </div>
  );
};

export default ScrubChartsCustom;

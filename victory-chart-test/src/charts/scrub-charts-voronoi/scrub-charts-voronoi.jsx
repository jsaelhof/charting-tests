import React, {useState, useEffect} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import simple from "../../data/simple.json";
import simple2 from "../../data/simple2.json";
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

const ScrubChartsVoronoi = () => {
  const classes = useStyles();

  const [chartData, setChartData] = useState(null);
  const [dataSet, setDataSet] = useState(simple);

  useEffect(() => {
    const xDomain = [
      moment(first(dataSet).date).valueOf(),
      moment(last(dataSet).date).valueOf(),
    ];
    const xTicks = ticksForDomain(xDomain, "days");

    setChartData({
      xDomain,
      xTicks,
    });
  }, [dataSet]);

  if (!chartData) return null;

  return (
    <div className={classes.grid}>
      <div className={classes.title}>
        Voronoi: Two charts using a third chart overlaid to create a unified
        tooltip through the underlying charts.
        <div style={{fontSize: 10, marginTop: 16}}>
          This is done using Victory's Voronoi Container which creates a mesh
          around the data (Light grey rectangles over this chart). An
          onActivatedData event handler allows access to the hovered points,
          which should only be a single point on this line. Unfortunately, with
          this data set, the point at April 25 refuses to activate. Changing the
          data set to add or remove a point fixes it. This is concerning to me
          as a workable solution as we have no control over how the voronoi mesh
          is defined.
        </div>
      </div>

      <div className={classes.row2}>
        <Chart
          data={dataSet}
          dataKey="y"
          title="Tubing"
          xDomain={chartData.xDomain}
          xTicks={chartData.xTicks}
        />
      </div>

      <div className={classes.row3}>
        <Chart
          data={dataSet}
          dataKey="y"
          title="Casing"
          xDomain={chartData.xDomain}
          xTicks={chartData.xTicks}
        />
      </div>

      <div className={classes.brush}>
        <Brush xDomain={chartData.xDomain} xTicks={chartData.xTicks} />
      </div>

      <div>
        Viewing{" "}
        {dataSet === simple ? "7-day (04/25 can't be hovered)" : "8-day"}
        <div
          className={classes.button}
          style={{backgroundColor: "red"}}
          onClick={() => {
            setDataSet(simple);
          }}
        >
          View 7-Day (Broken)
        </div>
        <div
          className={classes.button}
          onClick={() => {
            setDataSet(simple2);
          }}
        >
          View 8-Day (Works)
        </div>
      </div>
    </div>
  );
};

export default ScrubChartsVoronoi;

import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FlowRate from "./charts/flow-rate/flow-rate";
import CyclesChart from "./charts/cycles-chart/cycles-chart";
import ScrubChartsVoronoi from "./charts/scrub-charts-voronoi/scrub-charts-voronoi";
import ScrubChartsCursor from "./charts/scrub-charts-cursor/scrub-charts-cursor";
import ScrubChartsVoronoiAlt from "./charts/scrub-charts-voronoi-alt/scrub-charts-voronoi-alt";

const useStyles = makeStyles((theme) => ({
  page: {
    margin: 16,
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <FlowRate />
      <CyclesChart />
      <ScrubChartsVoronoi />
      <ScrubChartsVoronoiAlt />
      <ScrubChartsCursor />
    </div>
  );
};

export default App;

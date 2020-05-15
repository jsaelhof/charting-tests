import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LineChart from "./charts/line-chart/line-chart";
import CyclesChart from "./charts/cycles-chart/cycles-chart";

const useStyles = makeStyles(() => ({
  page: {
    margin: 16,
  },
}));

const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.page}>
      <LineChart />
      <CyclesChart />
    </div>
  );
};

export default App;

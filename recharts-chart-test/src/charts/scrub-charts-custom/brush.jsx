import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  LineChart,
  Line,
  YAxis,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {SizeMe} from "react-sizeme";

const useStyles = makeStyles((theme) => ({
  chart: {
    display: "grid",
    gridTemplateColumns: "120px minmax(0,1fr)",
    gridAutoFlow: "column",
    height: "100%",
  },
}));

const CursorLine = (props) => (
  <path
    stroke="black"
    d={`M${props.points[0].x},${props.points[0].y}L${props.points[1].x},${props.points[1].y}`}
  ></path>
);

const Brush = ({yDomain, xDomain, xTicks}) => {
  const classes = useStyles();

  return (
    <div className={classes.chart}>
      <div />
      <SizeMe monitorHeight>
        {({size}) => (
          <ResponsiveContainer width="100%" height={size.height}>
            <LineChart margin={{top: 10, right: 100, bottom: 0, left: 10}}>
              <Line
                data={xTicks.map((v) => ({date: v, y: 50}))}
                dataKey={"y"}
                dot={false}
                isAnimationActive={false}
                strokeWidth={0}
                activeDot={false}
              />

              <YAxis tick={false} domain={[0, 100]} axisLine={false} />

              <XAxis
                domain={xDomain}
                scale="time"
                type="number"
                dataKey={"date"}
                tick={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={() => null} cursor={<CursorLine />} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </SizeMe>
    </div>
  );
};

export default Brush;

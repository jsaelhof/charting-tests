import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Line, ResponsiveLine} from "@nivo/line";
import data from "../../data/tubing";
import moment from "moment";
import {theme} from "../../theme/theme";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: [[48, 0, 24, 0]],
    paddingTop: 8,
    borderTop: "1px solid grey",
  },

  chart: {
    width: "100%",
    height: 200,
  },
}));

const Tick = ({x, y, lineX, lineY, textY, value}) => (
  <g transform={`translate(${x}, ${y})`}>
    <line
      x1={lineX}
      y1={0}
      x2={lineX}
      y2={lineY}
      style={{stroke: "rgb(0,0,0)", strokeWidth: 1}}
    />
    <text
      style={{
        fontSize: 10,
        fill: "rgb(25,25,25)",
        transform: `translateY(${textY}px)`,
        textAnchor: "start",
        dominantBaseline: "text-before-edge",
      }}
    >
      {moment(value).utc().format("MM/DD")}
    </text>
  </g>
);

const LineChart = () => {
  const classes = useStyles();

  return (
    <div style={{height: 200}}>
      <ResponsiveLine
        theme={theme}
        enablePoints={false}
        enableGridX={false}
        enableGridY={false}
        margin={{top: 60, right: 80, bottom: 60, left: 80}}
        axisLeft={{}}
        axisBottom={{
          // This can be a function or a d3 format specifier.
          //format: (date) => moment(date.getTime()).format("HH:mm"), //%H:%M",

          // This can be an array of tick values or these secret strings which are actually pretty useful.
          tickValues: "every day",

          tickSize: 5,

          // Customize the tick.
          renderTick: Tick,
        }}
        data={[
          {
            id: "whatever",
            data: data.map((d) => ({
              x: new Date(d.date).getTime(),
              y: d.tubing,
            })),
          },
        ]}
        xScale={{
          type: "time",

          // This is a D3 format specifer which tells the xScale how to parse the time
          // value (X) in the data. Since I've made the time a unix epoch in milliseconds,
          // this must tuse %Q. If you chnage the data format, you must remember to change
          // this. This took way too long to figure out, especially since the axis format
          // parameter looks identical but is ued to output text instead of parse a time.
          format: "%Q",
        }}
      />
    </div>
  );
};

export default LineChart;

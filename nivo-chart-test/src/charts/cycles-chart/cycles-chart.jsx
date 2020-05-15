import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import cycles from "../../data/cycles.json";
import moment from "moment";
import {plungerCycleArrival} from "../../constants/plunger-cycle-arrival";
import last from "lodash/last";
import first from "lodash/first";
import {ResponsiveScatterPlot} from "@nivo/scatterplot";
import {theme} from "../../theme/theme";
import {SizeMe} from "react-sizeme";
import {scaleTime} from "d3-scale";

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

const buildCycleComponent = (width, domain, cycleFocus) => ({node}) => {
  // Nivo doesnt give any access to the d3 scale function it uses to draw the SVG with.
  // It gives the resolved position of X1,Y1 but to resolve the postion of X2,Y2, we'll have to build
  // our own scale based on the domain and range. Because the range changes each time the graph
  // width changes, it has to be rebuilt when that change happens. It also has to take into account
  // the margin values passed into the chart component. This works but it requires us to match the
  // internal workings of the chart component in order to draw a point with a duration.
  const xFunctor = scaleTime()
    .domain(domain)
    .range([0, width - 80]); // Ugly...have to subtract the left and right margins provided to the chart from the parent width so the range is correct.

  // Resolve the X position of the two points in the chart.
  const x = xFunctor(node.data.date);
  const x2 = xFunctor(node.data.endDate);

  // Gather some state to determine how to color each node.
  if (cycleFocus) console.log(cycleFocus);
  const hovered = cycleFocus && cycleFocus === node.data.date.getTime();
  const userIsHovering = cycleFocus !== null;

  // Return the SVG Rect for the cycle.
  return (
    <rect
      x={x}
      y={0}
      width={x2 - x}
      height={node.y}
      fill={plungerCycleArrival[node.data.cycle.arrival.category]}
      opacity={userIsHovering && !hovered ? 0.4 : 1}
      stroke={"rgba(0,0,0,0.5)"}
    />
  );
};

const CyclesChart = () => {
  const classes = useStyles();

  const series = cycles.map((cycle) => ({
    ...cycle,
    x: new Date(cycle.date),
    date: new Date(cycle.date),
    endDate: new Date(cycle.endDate),
  }));

  const [cycleFocus, setCycleFocus] = useState(null);

  // Define the full domain. I'm using the extent of the data which I know is sorted by date.
  const domain = [first(series).date, last(series).endDate];

  return (
    <div>
      <div className={classes.title}>
        Scatter Plot with custom mark components that have a duration on the
        X-axis (Uses XAxis scale function configured directly through D3 since
        Nivo does not provide this)
      </div>
      <div className={classes.chart}>
        <div>Cycles</div>
        <SizeMe>
          {({size}) => {
            return (
              <div style={{height: 80}}>
                <ResponsiveScatterPlot
                  theme={theme}
                  data={[{id: "whatever", data: series}]}
                  // Pass a few options to build a Node component to be rendered for each node.
                  renderNode={buildCycleComponent(
                    size.width,
                    domain,
                    cycleFocus,
                  )}
                  tooltip={() => null}
                  onMouseMove={({data}) => {
                    // Have to check this ourselves because mouse happens many times over the same point.
                    // An onMouseOver for the mark itself would be nicer.
                    if (data.date.getTime() !== cycleFocus)
                      setCycleFocus(data.date.getTime());
                  }}
                  // DOESN'T WORK. I don't know why.
                  onMouseLeave={() => {
                    setCycleFocus(null);
                  }}
                  enableGridX={false}
                  enableGridY={false}
                  xScale={{
                    type: "time",

                    // NOTE: Setting a domain on a time series scale seems to only work if you set format: "native" and
                    // use native js date objects as the x value in the series. Even if you make the domain values match
                    // the format specifier, they don't seem to work.
                    format: "native",
                    min: domain[0],
                    max: domain[1],

                    // This is a D3 format specifer which tells the xScale how to parse the time
                    // value (X) in the data. Since I've made the time a unix epoch in milliseconds,
                    // this must use %Q. If you chnage the data format, you must remember to change
                    // this. This took way too long to figure out, especially since the axis format
                    // parameter looks identical but is used to output text instead of parse a time.
                    // format: "%Q",
                  }}
                  yScale={{
                    type: "linear",
                    min: 0,
                    max: 1,
                  }}
                  margin={{top: 0, right: 80, bottom: 20, left: 0}}
                  axisLeft={{
                    tickSize: 0,
                    format: () => null,
                  }}
                  axisBottom={{
                    // This can be a function or a d3 format specifier.
                    // Not using this anymore since I'm using a custom rendered tick.
                    // format: (date) => moment(date.getTime()).format("HH:mm"), //%H:%M",

                    // This can be an array of tick values or these secret strings which are actually pretty useful.
                    tickValues: "every day",

                    tickSize: 5,

                    // Customize the tick. Can't seem to use a component JSX here, but can use a function.
                    renderTick: (tickConfig) => (
                      <g
                        transform={`translate(${tickConfig.x}, ${tickConfig.y})`}
                      >
                        <line
                          x1={tickConfig.lineX}
                          y1={0}
                          x2={tickConfig.lineX}
                          y2={tickConfig.lineY}
                          style={{stroke: "rgb(0,0,0)", strokeWidth: 1}}
                        />
                        <text
                          style={{
                            fontSize: 10,
                            fill: "rgb(25,25,25)",
                            transform: `translateY(${tickConfig.textY}px)`,
                            textAnchor: "start",
                            dominantBaseline: "text-before-edge",
                          }}
                        >
                          {moment(tickConfig.value).utc().format("MM/DD")}
                        </text>
                      </g>
                    ),
                  }}
                />
              </div>
            );
          }}
        </SizeMe>
      </div>
    </div>
  );
};

export default CyclesChart;

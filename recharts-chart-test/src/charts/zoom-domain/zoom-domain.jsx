import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {XAxis, YAxis, ResponsiveContainer, AreaChart, Area} from "recharts";
import data from "../../data/data.json";
import moment from "moment";
import last from "lodash/last";
import first from "lodash/first";
import {ticksForDomain} from "../../utils/ticks-from-domain";

const useStyles = makeStyles(() => ({
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

  button: {
    width: "100%",
    height: 60,
    backgroundColor: "beige",
    borderRadius: 10,
    margin: 5,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(0,0,0,0.4)",
  },
}));

function ZoomDomain() {
  const classes = useStyles();

  // Tracks whether we are zoomed or not.
  const [zoom, setZoom] = useState(false);

  // Tracks when to show the ticks.
  // Recharts animates the area series but not the ticks.
  // This allows me to hide the ticks when the animation starts and show them when it finishes.
  const [showTicks, setShowTicks] = useState(false);

  // Map the data into a series. My date is using timestamps like 2020-04-30T14:55:00.000Z.
  // I'm finding recharts plots time best as unix timestamps.
  // Moment's valueOf method returns a unix timestamp in milliseconds.
  const seriesData = data.map((d) => ({...d, date: moment(d.date).valueOf()}));

  // Define the zoom domain. I'm using the start of the last day of data to the end of the data.
  const zoomDomain = [
    moment("2020-04-30T00:00:00.000Z").valueOf(),
    last(seriesData).date,
  ];

  // Define the full domain. I'm usoing the extent of the data which I know is sorted by date.
  // Recharts has some cool ways of doing domains like ["dataMin","dataMax"] which figures out the
  // extent interally but I need to know the dates here so I can work with them to figure out the ticks I want.
  const fullDomain = [first(seriesData).date, last(seriesData).date];

  // Get hourly ticks within the zoom domain.
  const zoomTicks = ticksForDomain(zoomDomain, "hours");

  // Get daily ticks within the full domnain.
  const fullTicks = ticksForDomain(fullDomain, "days");

  return (
    <div>
      <div className={classes.title}>
        Area chart that can be zoomed by providing a custom domain and set of
        ticks. Utilizes Recharts out-of-the-box animation.
      </div>
      <div className={classes.chart}>
        <div
          className={classes.button}
          onClick={() => {
            setShowTicks(false);
            setZoom(!zoom);
          }}
        >
          {zoom ? "Zoom Out" : "Zoom In"}
        </div>

        {/* 
        Creates a responsive (resizable) chart wrapper.
        Basically like a SizeMe component.
        This works but has the same issue that React-Vis has when used in a CSS Grid...the chart will grow 
        as the grid expands but doesn't shrink as the grid shrinks. I've solved that issue here and in React-Vis 
        by defining the column size as "minmax(0,1fr)"" instead of just "1fr". This works in some cases but 
        I've also had this fail to fix the issue in the analysis grid in portal-ui. SizeMe works well though 
        and since this effectively the same thing as using a SizeMe, that might be our better choice.
       */}
        <ResponsiveContainer width={"100%"} height={300}>
          {/* 
          Create an area chart. 
          Since this chart is inside a responsive container, we don't need to provide width and height.
          Margins just add interior margins between the axes and the edges of the chart.
          Here I'm adding 100px to the right because I want my last tick to have room to draw outside the chart bounds.
        */}
          <AreaChart margin={{top: 10, right: 100, bottom: 0, left: 10}}>
            {/* Define a gradient to fill the area with */}
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Plot an Area Series */}
            <Area
              // Defines the curve fitting for the line
              type="monotone"
              // The key in each data object to plot
              dataKey="flowRate"
              // Storke Color
              stroke="#8884d8"
              // By default, Recharts puts an ugly dot on each data point in the line.
              // You have to explicitly turn it off.
              // You can pass a configuration object (strokee, radius) or a component here to customize it but i just wanted it off.
              dot={false}
              // The data series to plot
              data={seriesData}
              // How long to animate.
              // Animation is on by default and there is a separate prop to disable it.
              animationDuration={800}
              // Handles what to do when the animation finishes.
              // In this case, I'm hiding the ticks while it's transitioning from zoom in to zoom out.
              // When it finsihes, show the ticks again.
              onAnimationEnd={() => {
                setShowTicks(true);
              }}
              // Fill the Area with a gradient
              fill="url(#colorUv)"
            />

            <XAxis
              // The domain of the data to display.
              // Recharts provides some cool options for this over React-Vis but ultimately I needed to
              // know the dates for calculating ticks.
              domain={zoom ? zoomDomain : fullDomain}
              // Helps Recharts know we are plotting time.
              // When setting time you must set type="number" and provide a domain.
              scale="time"
              // Required when using scale="time"
              type="number"
              // The key in each data object to use as the X value.
              // This can be a string label or it can be a function that transforms the data.
              // (for example, this could transfrom the unix timestamp to a moment object)
              dataKey={"date"}
              // Manually define which ticks to use.
              // Recharts can auto generate ticks but i'm finding that the can be a bit weird in a time-series.
              // They can appear spaced unevenly.
              // Here i'm taking control by using the domain of the data to generate ticks where I think they would be best.
              ticks={zoom ? zoomTicks : fullTicks}
              // Format the tick value. "date" is a unix timestamp here.
              tickFormatter={(date) => {
                const m = moment(date).utc();
                return showTicks
                  ? zoom
                    ? m.hour() === 0
                      ? m.format("MM/DD")
                      : m.format("HH:mm")
                    : m.format("MM/DD")
                  : "";
              }}
              // Length of the tick line in pixels. 0 hides them. The ticks are being hidden during the animated zoom in/out transition.
              tickSize={showTicks ? 10 : 0}
              // How far to draw the tick labels from the tick lines
              tickMargin={5}
              // Some simple tick styling using a configuration object
              tick={{
                fill: "rgba(0,0,0,0.6)",
                textAnchor: "start",
                fontSize: "0.7em",
              }}
              // This helps trim the series so they don't draw outside the axes
              allowDataOverflow={true}
              // Recharts figures out which ticks to show by default.
              // When you give it your own ticks like we are, it will still remove some of them by default if
              // the width of a tick crashes into it's neighbor. When it does this you can wind up with
              // uneven ticks due to somee ticks beeing wider than others (depending on the width of the measured text).
              // This value sets a minimum tick width. By using 20 here, which is wider than any of my ticks, it helps to make
              // sure that the ticks measure at a consistent size and maintian even spacing.
              // Another option is to use interval={0} which tells Recharts to use all of the provided ticks regardless of
              // whether they crash into each other or not. If I was using that, I would make sure my tick generator did its
              // own work to ensure ticks were not too close together.
              minTickGap={20}
            />
            <YAxis
              // Some simple tick styling using a configuration object
              tick={{
                fill: "rgba(0,0,0,0.6)",
                textAnchor: "end",
                fontSize: "0.7em",
              }}
              // Length of the tick line in pixels.
              tickSize={0}
              tickMargin={10}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ZoomDomain;

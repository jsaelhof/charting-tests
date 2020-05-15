import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import data from "../../data/data.json";
import {SizeMe} from "react-sizeme";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryContainer,
  VictoryArea,
} from "victory";
import moment from "moment";
import customTheme from "../../themes/custom-theme.json";
import {ticksForDomain} from "../../utils/ticks-from-domain";
import first from "lodash/first";
import last from "lodash/last";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: [[48, 0, 24, 0]],
    paddingTop: 8,
    borderTop: "1px solid grey",
  },

  chart: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: `120px minmax(0,1fr)`,
  },

  button: {
    width: "100%",
    height: 60,
    backgroundColor: "beige",
    borderRadius: 10,
    margin: 5,
    marginTop: 16,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(0,0,0,0.4)",
  },
}));

const FlowRate = () => {
  const classes = useStyles();

  // Tracks whether we are zoomed or not.
  const [zoom, setZoom] = useState(false);

  // Tracks when to show the ticks.
  // Recharts animates the area series but not the ticks.
  // This allows me to hide the ticks when the animation starts and show them when it finishes.
  const [showTicks, setShowTicks] = useState(true);

  // Map the data into a series. My date is using timestamps like 2020-04-30T14:55:00.000Z.
  // I'm finding victory plots time best as JS dates.
  // Moment's toDate method returns a JS Date.
  const seriesData = data.map((d) => ({...d, date: moment(d.x).toDate()}));

  // Define the zoom domain. I'm using the start of the last day of data to the end of the data.
  const zoomDomain = [
    moment("2020-04-30T00:00:00.000Z").toDate(),
    last(seriesData).date,
  ];

  // Define the full domain. I'm using the extent of the data which I know is sorted by date.
  const fullDomain = [first(seriesData).date, last(seriesData).date];

  // Get hourly ticks within the zoom domain.
  const zoomTicks = ticksForDomain(zoomDomain, "hours");

  // Get daily ticks within the full domnain.
  const fullTicks = ticksForDomain(fullDomain, "days");

  return (
    <div>
      <div className={classes.title}>
        Area chart that can be zoomed by providing a custom domain and set of
        ticks. Utilizes Victory's out-of-the-box animation.
      </div>
      <div className={classes.chart}>
        <div>
          <div>Flow Rate</div>
          <div
            className={classes.button}
            onClick={() => {
              setShowTicks(false);
              setZoom(!zoom);
              setTimeout(() => setShowTicks(true), 1200);
            }}
          >
            {zoom ? "Zoom Out" : "Zoom In"}
          </div>
        </div>
        <SizeMe>
          {({size}) => {
            return (
              <div>
                <svg style={{height: 0}}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </svg>
                <VictoryChart
                  width={size.width}
                  height={300}
                  theme={customTheme}
                  containerComponent={<VictoryContainer responsive={false} />}
                  padding={{left: 60, bottom: 30, right: 100, top: 0}}
                >
                  <VictoryArea
                    data={seriesData}
                    scale={{x: "time"}}
                    x={"date"}
                    animate={{
                      duration: 1000,
                      onLoad: {
                        duration: 100,
                      },
                    }}
                    domain={{x: zoom ? zoomDomain : fullDomain}}
                    style={{
                      data: {
                        fill: "url(#colorUv)",
                        fillOpacity: 0.7,
                        stroke: "#8884d8",
                        strokeWidth: 1,
                      },
                    }}
                  />
                  <VictoryAxis
                    tickValues={zoom ? zoomTicks : fullTicks}
                    tickFormat={(t) => {
                      const m = moment(t).utc();
                      return showTicks
                        ? zoom
                          ? m.hour() === 0
                            ? m.format("MM/DD")
                            : m.format("HH:mm")
                          : m.format("MM/DD")
                        : "";
                    }}
                    scale={"time"}
                    style={{
                      ticks: {
                        size: showTicks ? 5 : 0,
                      },
                    }}
                  />
                  <VictoryAxis dependentAxis />
                </VictoryChart>
              </div>
            );
          }}
        </SizeMe>
      </div>
    </div>
  );
};

export default React.memo(FlowRate);

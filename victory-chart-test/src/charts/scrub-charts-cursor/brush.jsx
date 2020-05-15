import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {SizeMe} from "react-sizeme";
import {
  VictoryLine,
  VictoryGroup,
  VictoryCursorContainer,
  LineSegment,
} from "victory";
import customTheme from "../../themes/custom-theme.json";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  chart: {
    display: "grid",
    gridTemplateColumns: "120px minmax(0,1fr)",
    gridAutoFlow: "column",
    height: "100%",
  },
}));

const Brush = ({xDomain, xTicks}) => {
  const classes = useStyles();

  const [focus, setFocus] = useState(null);

  return (
    <div className={classes.chart}>
      <div />
      <SizeMe monitorHeight>
        {({size}) => {
          return (
            <div>
              {/* 
              VictoryGroup is like a VictoryChart but with no axes.
               */}
              <VictoryGroup
                width={size.width}
                height={size.height}
                theme={customTheme}
                containerComponent={
                  // Override the default with container with one of the special versions, in this case a Cursor Container
                  <VictoryCursorContainer
                    responsive={false}
                    cursorDimension="x"
                    cursorLabel={({datum}) =>
                      `${moment(datum.x).utc().format("MMM DD, HH:mm")}`
                    }
                    cursorComponent={
                      // Override the default cursor component.
                      // I would have liked to have been able to change the color without having to completeely redefine the component but I couldn't figure it out.
                      <LineSegment
                        style={{
                          stroke: "rgba(0,0,0,0.15)",
                        }}
                      />
                    }
                    // Track the cursor movement and figure out if it's closer to the next or previous point.
                    // This is relatively easy when working with whole days.
                    // But this is ugly because in many cases you might have to retrieve the point before and after
                    // and figure out where in that range this point falls to deterine which point its closer to.
                    // Theres a ton of info, including scale functions in the props arg which would be helpful.
                    // Regardless, this approach does require that you manually assign the ticks and figure everything out.
                    onCursorChange={(value, props) => {
                      if (value === null) {
                        setFocus(null);
                      } else {
                        const m = moment(value).utc();
                        setFocus(
                          m.hour() < 12
                            ? m.startOf("day").valueOf()
                            : m.endOf("day").valueOf(),
                        );
                      }
                    }}
                  />
                }
                padding={{left: 60, bottom: 30, right: 100, top: 10}}
              >
                {/* 
                Shows the line. I did this as a chart sharing the same domain.
                */}
                {focus && (
                  <VictoryLine
                    data={[
                      {x: new Date(focus), y: 0},
                      {x: new Date(focus), y: 1},
                    ]}
                    scale={{x: "time"}}
                    domain={{x: xDomain, y: [0, 1]}}
                  />
                )}

                {/* This is the invisible series that the cursor tracks */}
                <VictoryLine
                  data={xTicks.map((t, i) => ({x: new Date(t), y: 0}))}
                  scale={{x: "time"}}
                  domain={{x: xDomain}}
                  // Have to use a custom style object.
                  style={{
                    data: {
                      strokeWidth: 0,
                    },
                  }}
                />
              </VictoryGroup>
            </div>
          );
        }}
      </SizeMe>
    </div>
  );
};

export default Brush;

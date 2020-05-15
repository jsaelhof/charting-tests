import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {SizeMe} from "react-sizeme";
import {
  VictoryLine,
  VictoryGroup,
  VictoryVoronoiContainer,
  VictoryVoronoi,
} from "victory";
import customTheme from "../../themes/custom-theme.json";

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
      <SizeMe>
        {({size}) => {
          return (
            <div>
              {/* 
              VictoryGroup is like a VictoryChart but with no axes.
               */}
              <VictoryGroup
                width={size.width}
                height={220}
                theme={customTheme}
                padding={{left: 60, bottom: 30, right: 100, top: 10}}
              >
                {/* 
                Shows the line. I did this as a chart sharing the same domain.
                */}
                {focus && (
                  <VictoryLine
                    // Name this series so we can VoronoiBlacklist it.
                    name="cursor"
                    data={[
                      {x: new Date(focus), y: 0},
                      {x: new Date(focus), y: 1},
                    ]}
                    scale={{x: "time"}}
                    domain={{x: xDomain, y: [0, 1]}}
                  />
                )}

                {/* This is the invisible series that the voronoi tracks */}
                <VictoryLine
                  data={xTicks.map((t, i) => ({x: new Date(t), y: 0}))}
                  scale={{x: "time"}}
                  domain={{x: xDomain}}
                  style={{
                    data: {
                      strokeWidth: 0,
                    },
                  }}
                />

                {/* This IS necessary to make this function.
                 In this example I'm using an overlaid voronoi series instead of the Voronoiontainer.
                 It doesn't have the 04/25 issue.
                 It DOES have a different issue which is that it seems to require a hardcoded height (in the VictoryGroup)
                 When i use SizeMe and have it monitor the height (like I do in the other Voronoi example), the height grows
                 by a pixel or so on each render causing an endless flood of re-renders and a perputually growing graph height.
                 Seems like it's always something...
                 This also shows how complicated the event system in Victory is. 
                 That mouse over definition is kinda complicated.
                 */}
                <VictoryVoronoi
                  style={{data: {stroke: "rgba(0,0,0,0.15)", strokeWidth: 0.5}}}
                  data={xTicks.map((t, i) => ({x: new Date(t), y: 0}))}
                  events={[
                    {
                      target: "data",
                      eventHandlers: {
                        onMouseOver: () => {
                          return [
                            {
                              target: "data",
                              mutation: ({datum}) => {
                                setFocus(new Date(datum.x).getTime());
                              },
                            },
                          ];
                        },
                      },
                    },
                  ]}
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

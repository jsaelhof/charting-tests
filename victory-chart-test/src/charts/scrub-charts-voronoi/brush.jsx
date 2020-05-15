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
                  // Override the default with container with one of the special versions, in this case a Voronoi Container
                  <VictoryVoronoiContainer
                    responsive={false}
                    // Only worry about the X Dimension
                    voronoiDimension="x"
                    // Don't flag the points that are activasted when hovering the voronoi.
                    // This could be useful in some cases though as it allows you to have your points in their series react to the voronoi.
                    activateData={false}
                    // What to do when a point is activated.
                    // There is an array of points but in this case I'm only expecting one and always one.
                    // I would want to experiment with this array more.
                    onActivated={(points) => {
                      setFocus(points[0].x.getTime());
                    }}
                    // Do not use this named series when defining the voronoi.
                    // In this case, ignore the series i'm using to draw my cursor line.
                    voronoiBlacklist={["cursor"]}
                  />
                }
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

                {/* This is NOT necessary to make this function.
                 This is a second voronoi chart series just to allow you to visualize wheree the voronoi is being drawn. 
                 I did this specifically to try and debug why the Apr 25th voronoi section wasn't activating.
                 Events are not being used here but i left them in to show how freaking complicated the event system in 
                 Victory is.
                 */}
                <VictoryVoronoi
                  style={{data: {stroke: "rgba(0,0,0,0.15)", strokeWidth: 0.5}}}
                  data={xTicks.map((t, i) => ({x: new Date(t), y: 0}))}
                  // events={[
                  //   {
                  //     target: "data",
                  //     eventHandlers: {
                  //       onClick: () => {
                  //         return [
                  //           {
                  //             target: "data",
                  //             mutation: (props) => {
                  //               const fill = props.style && props.style.fill;
                  //               return fill === "black"
                  //                 ? null
                  //                 : {style: {fill: "black"}};
                  //             },
                  //           },
                  //         ];
                  //       },
                  //       onMouseOver: () => {
                  //         return [
                  //           {
                  //             target: "data",
                  //             mutation: (props) => {
                  //               console.log(props);
                  //             },
                  //           },
                  //         ];
                  //       },
                  //     },
                  //   },
                  // ]}
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

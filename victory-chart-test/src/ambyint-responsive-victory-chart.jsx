import React from "react";
import {SizeMe} from "react-sizeme";

const AmbyintResponsiveVictoryChart = (Component) => (props) => {
  return (
    <SizeMe>
      {({size}) => {
        return (
          <div>
            <Component size={size} {...props} />
          </div>
        );
      }}
    </SizeMe>
  );
};

export default AmbyintResponsiveVictoryChart;

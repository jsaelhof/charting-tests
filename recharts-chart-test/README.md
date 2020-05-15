## Pros

**Composable**

Create a chart, add in series, axes etc almost identically to React-Vis. This was probably my favorite feasture of React-Vis and would make transitioning very easy.

**Marks drawn for any chart can be customized/replaced**

In react-vis you typically needed to fall back to the CustomSVGSeries to draw custom marks. I've used custom marks to do things like drawing the dots on the event stream and the cycles charts.
https://recharts.org/en-US/guide/customize

**Very Customizable**

This is a big one for me personally. Most visual elements can be replaced with custom react components. In React-Vis you could style an axis tick but had to use a string of SVG. In Recharts you can give it a true React component allowing better re-use and a more "First Class" approach.

**Allows mapping of x/y keys**

The array of data provided can use keys like `{ date: <date>, tubingPressure: 10 }` (instead of `{x: <date>, y: 10 }`). Simply add props like `x={date}` and `y={tubingPressure}`. I like that because it allows the actual data to be more readable when debugging and when reading codee that transforms data to a series. The x and y props can also be functions that map the data which adds another level of power if needed.
https://recharts.org/en-US/api/Line#dataKey

**Syncronized Charts**

Interactions with some chart types can be syncronized. This is something we've done a lot in Well Health, SUrveillance and Analysis.
https://recharts.org/en-US/examples/SynchronizedLineChart

**Tons of Data Provided to Custom Components**

When using React-vis's CustomSVG series, you get very little info. Just the resolved x and y position in the chart and your original data. Accessing the scales to do marks with durations was impossible so i had to copy one of their classes and modify it to access the configured scale functions. Recharts provides a TON of data to the custom component...positions, all info aobut the X and Y axes, scales, etc. Very handy for making custom marks.

**Popular**

Recharts seems to be the most downloaded library. Here's a live comparison. Of these, React-Vis and React-ChartJS-2 are both looking for maintainers.

https://www.npmtrends.com/victory-vs-react-vis-vs-recharts-vs-@vx/shape-vs-@nivo/core-vs-react-chartjs-2

**Animation**

Animation works pretty nicely, particularly when changing the time-frame of a chart. React-vis did a horrible job of adding and removing points in the X-Axis. It was only really good for animating values in the Y. Recharts does a really nice job of sliding in new data as the domain in the X grows. This was something I really wanted to do in surveillance when changing timeframes but we scrapped because React-Vis jsut couldn't do it.

## Cons

**Documention is weak in places**

Example:

```
minTickGap (Number)
The minimum gap between two adjacent labels.
DEFAULT: 5  (5 what? Pixels?)
```

Also has confusing grammar in places:

```
If set false, no ticks will be drawn. If set a object, the option is the configuration of ticks. If set a React element, the option is the custom react element of drawing ticks.
```

Also something properties, particuarly around configuration objects or customization is not docuemnted.

**Time Series axes can be confusing to set up**

To make a chart plot values using time, the type of the axis must be set to Number (`type={"number"}`) and time values need to be converted to unix timestamp numbers. React-Vis allowed us to pass in moment objects.

**Auto generated ticks can be really weird**

I keep seeing cases where the auto generated ticks don't make a lot of sense. Some are missing...which I think is because they do some kind of check to see if the label will fit and if it won't, it drops the tick resulting in an uneven layout of ticks. This may be more of a problem with time-based axes.

**No Sunburst Chart**

There's no immediate Sunbrust component but something might be able to be done with their Pie Chart component (https://recharts.org/en-US/examples/TwoLevelPieChart). I'm not 100% sure. Also looks like someone might have written one? (https://www.npmjs.com/package/@latticejs/recharts-sunburst). I haven't looked at this lib at all and haven't even seen what it outputs.

## Notes

**NearestX/NearestXY from React-Vis**

React-Vis allowed you to put a listener on the chart to show which point you were closest to. I used this quite a bit iin surveillance to do the scrubbing through all the charts simultaneously. Recharts has onMouseOver and onMouseMove but they only fire when mousing directly over the points in a line (as opposed to anywhere in the chart bounds). Initally I struggled with this quite a bit because I was trying apply what I knew about hwo React-Vis works to Recharts. In the end, the best way to achieve this in Recharts is to use the Tooltip component. It's not intuitive immedately that you can use this component that shows a tooltip about the data point but with Recharts extensive customization, you can throw a tooltip on, remove any or all of it's default content and render anything you want...which is how I would have done the custom scrubber I built in surveillance. If you wanted to just have access to the data of the nearest point being hovered for some reason other than drawing something on the chart (say updating state), it might be possible to leverage a tooltip with no content? Kinda hacky but could work.

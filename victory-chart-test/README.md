### Pros

**Good Docs**

Seems well documented. Doesn't just list the props, it provides explanations and examples.

**Composable**
Create a chart, add in series, axes etc almost identically to React-Vis. This was probably my favorite feasture of React-Vis and would make transitioning very easy.

**Marks drawn for any chart can be customized/replaced**
In react-vis you typically needed to fall back to the CustomSVGSeries to draw custom marks. I've used custom marks to do things like drawing the dots on the event stream and the cycles charts.
https://formidable.com/open-source/victory/guides/custom-components

**Allows mapping of x/y keys**
The array of data provided can use keys like `{ date: <date>, tubingPressure: 10 }` (instead of `{x: <date>, y: 10 }`). Simply add props like `x={date}` and `y={tubingPressure}`. I like that because it allows the actual data to be more readable when debugging and when reading codee that transforms data to a series. The x and y props can also be functions that map the data which adds another level of power if needed.
https://formidable.com/open-source/victory/guides/themes

**Chart Themes**
It would be nice to extract a lot our common chart stylining into a theme. Themes can be applied per chart too so you could have different themes and use them on different pages.
https://formidable.com/open-source/victory/guides/themes

**Zoom, Brush, Selection Containers**

Victory has some really nice options for making charts that you can pan and zoom, select things etc. I only played with the VoronoiContainer (which was buggy, see below) but the pan and zoom looks pretty cool.
https://formidable.com/open-source/victory/docs/victory-zoom-container
https://formidable.com/open-source/victory/docs/victory-brush-container
https://formidable.com/open-source/victory/docs/victory-selection-container

### Cons

**Domain can be a bit weird**

If i put a domain on the axis, I can expand the chart wider than the extent of the data but not cut off data by using a smaller domain. It took me a while to figure out that to do this, I had to add a domain to the series component (ex. VictoryLine) which would then crop the data that fell outside the domain.

**Defining event handlers is really complicated**

https://formidable.com/open-source/victory/guides/events

There's lots written but it's still complicated. I've yet to find an actual list of what type of events you can assign handlers for. Most examples just use onClick. I assume it's just typically browser mouse events? At any rate, there's probably a lot of flexibility here but it's not super easy to understand.

**Themes**

There might be a way but i havent found out how to assign a global theme to all charts. Having to add the theme to each chart is flexible (you could have different themes for different cases) but also kind of a pain. I've also found that many things can't be styled without using a style object that implements a partial theme override. Most libs allow things like "tickSize={5}" but in Victory you have to create a style, then go figure out what the nested theme structure is to override the tick size. Felt kind of cumbersome.

**Tracking the mouse through the data is harder than it should be**

In the examples you can see some different ways i tracked the mouse through various charts. In the cycles chart, I had to resort to putting event handlers on the custom svg nodes because I couldn't get the victory events to work. In the line series chart examples, I had to do things like manually finding the closest X using an interpolated cursor or setting up voronois on the chart to try and capture what i was closest to. React-vis just had onNearestX and onNearestXY. Simple.

**Voronoi Container issues**

In one of my charts I overrode the standard Victory container with a VoronoiContainer as per their docs. One point in my data set is always skipped. Adding a day or taking one away makes that point accessible. I have no idea what's going on. I can add a Voronoi series to the same data and it picks it up fine. Feels like it might be buggy under the hood.

### Notes

**Responsiveness**

Victory doesn't provide a responsive container and recommends you use a library like SizeMe. Not a big problem since we use SizeMe already and could make our own wrapper. The issue i had is that when using SizeMe the chart doesn't resize smoothly. The height jumped around a bunch causing a jaggy experience. I spent an entire day working on trying to improve it before moving on. I finally found a counter-intuitive solution...I can make the container use responsive={false} and then control its size with SizeMe. We could maybe make our own wrapper but in general I think we'd probably just be throwing SizeMe's around most charts. That's what i'm finding i need to do with React-Vis and Recharts anyway so I guess it's a bit par for the course.

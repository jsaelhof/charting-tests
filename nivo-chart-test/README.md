## Pros

**Lots of Chart Types**

Bump, Bubble, Bullet, Choropleth, Chord, Heat Map, Network, Sankey, Stream, Swarm, Sunburst, Waffle...lots of types. It looks like you import each chart type individually so Nivo may be an option for just adding one chart type that another library doesn't support.

**Responsive Charts Seem Good**

They work out of the box as you'd expect.

**Nice Options For Ticks**

You can provide strings like "every day", "every 6 hours", etc to define the ticks on the axis. It's pretty cool and much simpler than building your own array of ticks. But the strings it can use are not documented and must be guessed at. I'd have to see if D3 defines/documents these and Nivo is just exposing the capability.

**Canvas Charts**

## Cons

**Pretty docs missing half the information**

For the amount of work they put into their docs, available properties are undocumented all over the place, particularly in regards to the axes. I've been struggling for hours to figure out how to format a tick properly or configure a scale.

**Not Composable**

Nivo doesn't appear to be composable like React-Vis, Victory and Recharts so you have to use the charts they provide as opposed to having a chart container that you can add pieces to (axes, series etc)

**Seems to be maintained by one person**

Every time I search about an issue, I find there's only one guy responding to questions, feature requests, bugs etc. Nivo also has three times as many open issues on the repo as the other libraries. I'd be concerned about how fast the author can deliver updates and whether it will end up becoming abandoned like React-Vis when he gets busy on something else.

**Probably the Least Like React-Vis**

General syntax and how some of the basic stuff works is the least like React-Vis. For example, instead of adding an X-Axis to a chart, each chart has axis props like bottomBorder where you configure the display and a separate xScale prop for configuring things like whether its a time axis. Not a deal breaker, just the least directly transferable.

**Time Axes Can Be Confusing**

The docs seeem to contradict themselves. I spent almost an hour trying to get the xFormat function prop to work because the docs say that a time axis has to have it. In the end I stumbled around until I learned that there's another format function as a prop of the axis configuration that does the formatting. I am able to delete the required xFormat without any issue.

**Not Very Fault Tolerant**

With other chart libs, I typically see things just don't render if the provided configuration is incorrect. Nivo seems to throw errors when the slightest thing is incorrect. My worry with this is that we might see more fatal errors in production due to some missing or unexpected data.

**Themeing is Undocumented**

I found out about themeing mostly from looking at source code. I can't seem to find any real documentation about it. It turned out to be required just to make an axis have a line :(.

## Notes

In general I've found Nivo to have potential but it just takes too long to get things to work. I've spent far longer getting the basic charts performing the way I need them to. That said, it's got a ton of chart types that can be imported individually. I think it's possible that if we need just one "special" chart type, we could use it.

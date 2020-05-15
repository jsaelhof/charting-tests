import moment from "moment";
import times from "lodash/times";

export const ticksForDomain = (domain, unit) => {
  const lastUnit = moment(domain[1]).clone().utc().startOf(unit).add(1, unit);
  const firstUnit = moment(domain[0]).clone().utc().startOf(unit);
  const units = lastUnit.diff(firstUnit, unit);

  const ticks = times(units, (i) => firstUnit.clone().add(i, unit))
    .filter((t) =>
      t.isBetween(moment(domain[0]), moment(domain[1]), null, "[]"),
    )
    .map((t) => t.valueOf());

  return ticks;
};

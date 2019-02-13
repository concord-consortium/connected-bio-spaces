import { types, Instance } from "mobx-state-tree";

/**
 * This model tries to reduce the number of options that need to be specified when defining an
 * annotation, by making lots of decisions in `formatted`. See tests.
 *
 * If we end up needing to add every little option, then we should make the model just look identical
 * to the annotation def.
 *
 * See https://github.com/chartjs/chartjs-plugin-annotation
 */

export const ChartAnnotationModel = types
  .model("ChartAnnotation", {
    type: types.string,   // "horizontalLine", "verticalLine", "box"
    value: types.maybe(types.number),
    color: types.optional(types.string, "red"),
    thickness: types.optional(types.number, 2),
    dashArray: types.array(types.number),
    label: types.maybe(types.string),
    labelOffset: types.optional(types.number, 0),
    xMin: types.maybe(types.number),
    xMax: types.maybe(types.number),
    yMax: types.maybe(types.number),
    yMin: types.maybe(types.number)
  })
  .views(self => ({
    get formatted() {
      let formatted: any = {
        borderColor: self.color,
        borderWidth: self.thickness
      };

      if (self.type === "horizontalLine") {
        formatted = {
          type: "line",
          mode: "horizontal",
          scaleID: "y-axis-0",
          value: self.value,
          label: {
            position: "right",
            yAdjust: self.labelOffset
          },
          ...formatted
        };
      } else if (self.type === "verticalLine") {
        formatted = {
          type: "line",
          mode: "vertical",
          scaleID: "x-axis-0",
          value: self.value,
          label: {
            position: "top",
            xAdjust: self.labelOffset
          },
          ...formatted
        };
      } else if (self.type === "box") {
        const { xMin, xMax, yMin, yMax } = self;
        formatted = {
          type: "box",
          xScaleID: "x-axis-0",
          yScaleID: "y-axis-0",
          backgroundColor: self.color,
          xMin, xMax, yMin, yMax,
          ...formatted
        };
      }

      if (self.label) {
        formatted.label.enabled = true;
        formatted.label.content = self.label;
      }

      if (self.dashArray.length) {
        formatted.borderDash = self.dashArray;
      }

      return formatted;
    }
  }));

export type ChartAnnotationType = Instance<typeof ChartAnnotationModel>;

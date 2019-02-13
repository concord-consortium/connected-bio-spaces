import { ChartAnnotationModel, ChartAnnotationType } from "./chart-annotation";
import { ChartDataModelType, ChartDataModel } from "./chart-data";

describe("chart annotations", () => {
  let annotation: ChartAnnotationType;
  let chart: ChartDataModelType;

  it("can create a vertical line annotation", () => {
    annotation = ChartAnnotationModel.create({
      type: "verticalLine",
      value: 10,
      label: "Test",
      dashArray: [10, 3]
    });

    expect(annotation.formatted).toEqual({
      type: "line",
      mode: "vertical",
      scaleID: "x-axis-0",
      value: 10,
      label: {
        content: "Test",
        enabled: true,
        position: "top",
        xAdjust: 0
      },
      borderColor: "red",
      borderDash: [10, 3],
      borderWidth: 2
    });
  });

  it("can create a horizontal line annotation", () => {
    annotation = ChartAnnotationModel.create({
      type: "horizontalLine",
      value: 10,
      label: "Test",
      labelOffset: 10,
      color: "blue",
      thickness: 5
    });

    expect(annotation.formatted).toEqual({
      type: "line",
      mode: "horizontal",
      scaleID: "y-axis-0",
      value: 10,
      label: {
        content: "Test",
        enabled: true,
        position: "right",
        yAdjust: 10
      },
      borderColor: "blue",
      borderWidth: 5
    });
  });

  it("can create a chart with annotations", () => {
    chart = ChartDataModel.create({
      name: "Samples",
      annotations: [{
        type: "verticalLine",
        value: 20
      }]
    });

    expect(chart.formattedAnnotations).toEqual([{
      type: "line",
      mode: "vertical",
      scaleID: "x-axis-0",
      value: 20,
      label: {
        position: "top",
        xAdjust: 0
      },
      borderColor: "red",
      borderWidth: 2
    }]);
  });

  it("can add annotations to charts", () => {
    chart = ChartDataModel.create({
      name: "Samples"
    });

    chart.addAnnotation(ChartAnnotationModel.create({
      type: "horizontalLine",
      value: 0
    }));

    expect(chart.formattedAnnotations).toEqual([{
      type: "line",
      mode: "horizontal",
      scaleID: "y-axis-0",
      value: 0,
      label: {
        position: "right",
        yAdjust: 0
      },
      borderColor: "red",
      borderWidth: 2
    }]);
  });

  it("can clear annotations from charts", () => {
    chart = ChartDataModel.create({
      name: "Samples"
    });

    chart.addAnnotation(ChartAnnotationModel.create({
      type: "horizontalLine",
      value: 0
    }));
    chart.addAnnotation(ChartAnnotationModel.create({
      type: "horizontalLine",
      value: 1
    }));

    expect(chart.formattedAnnotations.length).toBe(2);

    chart.clearAnnotations();

    expect(chart.formattedAnnotations.length).toBe(0);
  });

});

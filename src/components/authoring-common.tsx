import * as React from "react";
import { ConnectedBioAuthoring } from "../authoring";
import { ConnectedBioModelCreationType } from "../models/stores";

export const onSubmit = (setModelUrl: (url: string) => void) => (values: ConnectedBioModelCreationType) => {
  delete values.authoring;
  const encodedParams = encodeURIComponent(JSON.stringify(values));
  setModelUrl(`${location.href.replace(/\/\w*-authoring.html/, "/index.html")}?${encodedParams}`);
};

export const allowHideLeftPanel = (values: ConnectedBioAuthoring) => {
  const ui = values.ui!;
  const space = ui.investigationPanelSpace;
  return ((space === "populations" && ui.showPopulationSpace && !ui.showOrganismSpace && !ui.showBreedingSpace) ||
          (space === "organism" && !ui.showPopulationSpace && ui.showOrganismSpace && !ui.showBreedingSpace) ||
          (space === "breeding" && !ui.showPopulationSpace && !ui.showOrganismSpace && ui.showBreedingSpace));
};

export const validate = (setModelUrl: (url: string) => void) => (values: ConnectedBioAuthoring) => {
  // everytime the form updates we clear the url box at bottom and re-enable to submit button
  setModelUrl("");

  const errors: any = {};
  if (!values.ui!.showPopulationSpace && !values.ui!.showOrganismSpace && !values.ui!.showBreedingSpace) {
    errors.atLeastOneSpace = "Select at least one level to be available to the user";
  }

  if ((values.ui!.investigationPanelSpace === "populations" && !values.ui!.showPopulationSpace) ||
      (values.ui!.investigationPanelSpace === "organism" && !values.ui!.showOrganismSpace) ||
      (values.ui!.investigationPanelSpace === "breeding" && !values.ui!.showBreedingSpace)) {
    errors.showingHiddenSpace = "The selected level is not visible";
  }

  if (!values.leftPanel && !allowHideLeftPanel(values)) {
    errors.cantHideLeftPanel = "Can't hide left panel with the current level options";
  }

  if (values.populations!.showSwitchEnvironmentsButton &&
      !values.populations!.includeNeutralEnvironment &&
      values.populations!.environment === "neutral") {
    errors.cantStartWithNeutralIfHidden = "Can't start with mixed environment if it is not included as an option";
  }

  if (values.populations!.numHawks! < 0 || values.populations!.numHawks! > 10) {
    errors.numHawks = "Number of hawks must be between 0 and 10";
  }

  if (values.populations!.inheritance!.chanceOfMutations! < 0 ||
      values.populations!.inheritance!.chanceOfMutations! > 100) {
    errors.popChanceOfMutations = "Chance of mutations must be between 0 and 100";
  }

  if (values.populations!.initialPopulation!.white! + values.populations!.initialPopulation!.tan! > 100) {
    errors.initialPopulation = "First two percentages can't sum to more than 100%";
  }

  if (!values.populations!.enableColorChart! &&
        !values.populations!.enableGenotypeChart! && !values.populations!.enableAllelesChart!) {
    errors.onePopulationChart = "At least one graph must be selected";
  }

  if (values.breeding!.chanceOfMutations! < 0 ||
      values.breeding!.chanceOfMutations! > 100) {
    errors.breedingChanceOfMutations = "Chance of mutations must be between 0 and 100";
  }

  if ((!values.breeding!.enableColorChart! &&
      !values.breeding!.enableGenotypeChart! && !values.breeding!.enableSexChart!) ||
      (values.unit === "pea" &&
      !values.breeding!.enableColorChart! && !values.breeding!.enableGenotypeChart!)) {
    errors.oneBreedingChart = "At least on graph must be selected";
  }

  return errors;
};

export const error = (message: string) =>
  <div className="error" key={message}>
    <div className="warning">
      <svg className="icon" data-test="warning">
        <use xlinkHref="#icon-warning" />
      </svg>
    </div>
    {message}
  </div>;

export const handleResetForm = (setModelUrl: (url: string) => void, resetForm: (nextState?: any) => void) => () => {
  if (window.confirm(
`Do you want to reset all your settings?

This will delete all your changes and restore this page to its original default settings.`)) {
    resetForm();
    setModelUrl("");
  }
};

export const formattingHelp = () =>
  <div className="formatting-help-body">
    <h3>Formatting Help</h3>
    <table>
      <thead>
        <tr>
          <th>Markdown</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            # Big heading<br/><br/>
            ## Smaller heading
          </td>
          <td>
            <h1>Big heading</h1>
            <h2>Smaller heading</h2>
          </td>
        </tr>
        <tr>
          <td>
            Paragraphs must be separated by an empty line.<br/><br/>
            Second paragraph.
          </td>
          <td>
            Paragraphs must be separated by an empty line.<br/><br/>
            Second paragraph.
          </td>
        </tr>
        <tr>
          <td>
            **Bold text**<br/>
            *Italic text*<br/>
            Normal text
          </td>
          <td>
            <strong>Bold text</strong><br/>
            <em>Italic text</em><br/>
            Normal text
          </td>
        </tr>
        <tr>
          <td>
            1. Numbered<br/>
            2. List<br/><br/>
            * Bulleted<br/>
            * List
          </td>
          <td>
            <ol>
              <li>Numbered</li>
              <li>List</li>
            </ol>
            <ul>
              <li>Bulleted</li>
              <li>List</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>
            &lt;img<br/>
            src="http://connected-bio-spaces.concord.org/<wbr/>assets/unit/mouse/mouse_field.png"<br/>
            width="50"/&gt;
          </td>
          <td>
            <img src="http://connected-bio-spaces.concord.org/assets/unit/mouse/mouse_field.png" width="50"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>;

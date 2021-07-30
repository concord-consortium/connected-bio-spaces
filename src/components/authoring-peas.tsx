import * as React from "react";
import { useState } from "react";
import { Formik, Form, Field, FormikProps } from "formik";
import { ConnectedBioModelCreationType } from "../models/stores";
import { allowHideLeftPanel, error, formattingHelp, handleResetForm, onSubmit, validate } from "./authoring-common";

import "./formik-authoring.sass";

interface IProps {
  initialAuthoring: ConnectedBioModelCreationType;
}

export const PeasAuthoringComponent: React.FC<IProps> = ({initialAuthoring}) => {
  const [modelUrl, setModelUrl] = useState("");
  const [showingLinkCopied, setShowingLinkCopied] = useState(false);
  const [showingFormattingHelp, setShowingFormattingHelp] = useState(false);

  const handleCopyUrl = () => {
    if (!modelUrl) return;
    (navigator as any).clipboard.writeText(modelUrl);
    setShowingLinkCopied(true);
    window.setTimeout(() => setShowingLinkCopied(false), 2500);
  };

  const handleOpenUrl = () => {
    if (!modelUrl) return;
    window.open(modelUrl, "connected-bio-spaces");
  };

  const handleToggleFormatting = () => setShowingFormattingHelp(!showingFormattingHelp);

  return (
    <div className="formik-authoring peas">
      <div className="left-column">
        <div className="logo">
          <svg className="icon" data-test="top-bar-img">
            <use xlinkHref="#icon-logo" />
          </svg>
        </div>
      </div>
      <Formik
        initialValues={initialAuthoring}
        onSubmit={onSubmit(setModelUrl)}
        validate={validate(setModelUrl)}
      >
        {({ errors, values, dirty, resetForm }: FormikProps<ConnectedBioModelCreationType>) => (
          <div className="right-column">
            <div className="authoring-header">
              <h1>Connected Bio Authoring: Pea Unit Settings</h1>
              <button className="nice-button" type="reset" disabled={!dirty}
                  onClick={handleResetForm(setModelUrl, resetForm)}>
                <svg className="icon" data-test="top-bar-img">
                  <use xlinkHref="#icon-reset" />
                </svg>
                Reset all settings
              </button>
            </div>
            <div className="form-body">
              <Form>
                <div className="section level breeding">
                  <h2>Heredity Level</h2>
                  <h3>Heredity Level Instructions</h3>
                  <div className="instruction">
                    Optional: Add instructions for this level to be displayed in the right-hand panel of the simulation.
                  </div>
                  <Field name="breeding.instructions" as="textarea"
                    placeholder="Add instructions..."
                  />
                  <div className="formatting-help">
                    <div className="toggle-help" onClick={handleToggleFormatting}>
                      { showingFormattingHelp ? "Hide formatting help" : "Formatting help" }
                    </div>
                    { showingFormattingHelp && formattingHelp() }
                  </div>
                  <h3>Offspring: Mutations</h3>
                  <label>
                    <Field type="checkbox" name="breeding.breedWithMutations" />
                    Breed with mutations
                  </label>
                  <div className="instruction nested-instruction">
                    <b>Selected:</b> Mutations in pea shape genes may randomly occur in offspring and are
                    passed down.<br/>
                    <b>Unselected:</b> No mutations occur.
                  </div>
                  <label>
                    <Field type="checkbox" name="breeding.enableStudentControlOfMutations" />
                    Enable <b>Mutations</b> checkbox
                  </label>
                  <div className="instruction nested-instruction">
                    Allows for mutations to be turned on/off in the simulation
                  </div>
                  <label className={(!values.breeding!.breedWithMutations! &&
                      !values.breeding!.enableStudentControlOfMutations!) ? "disabled" : ""}>
                    Chance of mutations
                    <Field name="breeding.chanceOfMutations"
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      disabled={(!values.breeding!.breedWithMutations! &&
                        !values.breeding!.enableStudentControlOfMutations!)}
                    />
                    %&nbsp;
                    <span className="instruction">(0-100)</span>
                  </label>
                  {errors.breedingChanceOfMutations ?  error(errors.breedingChanceOfMutations as string) : null}
                  <h3>Inspect Gametes</h3>
                  <label>
                    <Field type="checkbox" name="breeding.enableInspectGametes" />
                    Enable <b>Inspect Gametes</b> button in the Breeding View
                  </label>
                  <h3>Genotype Labeling</h3>
                  <label>
                    <Field type="checkbox" name="breeding.showParentGenotype" />
                    Show parent genotype in the Inspect View
                  </label>
                  <label>
                    <Field type="checkbox" name="breeding.showOffspringGenotype" />
                    Show offspring genotype in the Inspect View
                  </label>
                  <h3>Data Graphs</h3>
                  <div className="instruction">
                    Select the graphs that can be displayed in the simulation. At least one graph must be shown.
                  </div>
                  <label>
                    <Field type="checkbox" name="breeding.enableColorChart" />
                    Enable <b>Pea Shape</b> graph button
                  </label>
                  <label>
                    <Field type="checkbox" name="breeding.enableGenotypeChart" />
                    Enable <b>Genotype</b> graph button
                  </label>
                  {errors.oneBreedingChart ?  error(errors.oneBreedingChart as string) : null}
                </div>
                <hr />
                <div className="submit">
                  <button className="nice-button"  type="submit"
                      disabled={modelUrl !== "" || Object.keys(errors).length > 0}>
                    <svg className="icon">
                      <use xlinkHref="#icon-submit" />
                    </svg>
                    Create model URL
                  </button>
                  <input value={modelUrl} />
                  <div className={`copy icon-button${modelUrl ? "" : " disabled"}`} onClick={handleCopyUrl}>
                    <svg className="icon">
                      <title>Copy model URL to the clipboard</title>
                      <use xlinkHref="#icon-copy" />
                    </svg>
                  </div>
                  <div className={`link-copied${showingLinkCopied ? " visible" : ""}`}>
                    Link copied
                  </div>
                  <div className={`open icon-button${modelUrl ? "" : " disabled"}`} onClick={handleOpenUrl}>
                    <svg className="icon">
                      <title>Open model in a new tab</title>
                      <use xlinkHref="#icon-open-external" />
                    </svg>
                  </div>
                </div>
                {
                  Object.keys(errors).length > 0 &&
                  <div className="error-list">
                    Please fix the following error{Object.keys(errors).length > 1 ? "s" : ""} before submitting:
                    {
                      Object.keys(errors).map(key => error(errors[key] as string))
                    }
                  </div>
                }
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

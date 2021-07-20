import * as React from "react";
import { useState } from "react";
import { Formik, Form, Field, FieldArray, FormikProps } from "formik";
import { ConnectedBioModelCreationType } from "../models/stores";
import { allowHideLeftPanel, error, formattingHelp, handleResetForm, onSubmit, validate } from "./authoring-common";

import "./formik-authoring.sass";

interface IProps {
  initialAuthoring: ConnectedBioModelCreationType;
}

export const MiceAuthoringComponent: React.FC<IProps> = ({initialAuthoring}) => {
  const [modelUrl, setModelUrl] = useState("");
  const [showingLinkCopied, setShowingLinkCopied] = useState(false);
  const [showingFormattingHelp, setShowingFormattingHelp] = useState([false, false, false]);

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

  const handleToggleFormatting = (index: number) => () => {
    const newShowingFormattingHelp = [...showingFormattingHelp];
    newShowingFormattingHelp[index] = !newShowingFormattingHelp[index];
    setShowingFormattingHelp(newShowingFormattingHelp);
  };

  return (
    <div className="formik-authoring mice">
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
              <h1>Connected Bio Authoring: Mouse Unit Settings</h1>
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
                <div className="section explore">
                  <h2>Explore Levels</h2>
                  <div className="instruction">
                    Set the levels to be displayed in the simulation. Note that at least one level needs to
                    be selected.
                  </div>
                  <div>
                    <label>
                      <Field type="checkbox" name="ui.showPopulationSpace" />
                      Show <b>Population</b> level
                    </label>
                    <label>
                      <Field type="checkbox" name="ui.showOrganismSpace" />
                      Show <b>Organism</b> level
                    </label>
                    <label>
                      <Field type="checkbox" name="ui.showBreedingSpace" />
                      Show <b>Heredity</b> level
                    </label>
                    {errors.atLeastOneSpace ? error(errors.atLeastOneSpace as string) : null}
                  </div>
                  <div>
                    <label>
                      Initial level displayed
                      <Field name="ui.investigationPanelSpace" as="select">
                        <option value="none">None</option>
                        <option value="populations" disabled={!values.ui!.showPopulationSpace}>Population</option>
                        <option value="organism" disabled={!values.ui!.showOrganismSpace}>Organism</option>
                        <option value="breeding" disabled={!values.ui!.showBreedingSpace}>Heredity</option>
                      </Field>
                    </label>
                    {errors.showingHiddenSpace ? error(errors.showingHiddenSpace as string) : null}
                  </div>
                  <div className={!allowHideLeftPanel(values) ? "disabled" : ""}>
                    <label>
                      <Field type="checkbox" name="leftPanel"
                        disabled={!allowHideLeftPanel(values) && !errors.cantHideLeftPanel }/>
                      Show Explore/Sample left-hand column
                    </label>
                    <div className="instruction">
                      The option to hide the left-hand column is available when only a single level is shown,
                      and that level is selected as the initial level displayed.<br/>
                      Note that hiding this column also hides the <b>Collect mouse</b> button in
                      the <b>Population</b> level.
                    </div>
                    {errors.cantHideLeftPanel ? error(errors.cantHideLeftPanel as string) : null}
                  </div>
                </div>
                <div className="section sample">
                  <h2>Samples Collection</h2>
                  <div className="instruction">
                    Optional: Preload the Samples collection with up to 6 mice.
                  </div>
                  <div className="backpack-items">
                    <FieldArray
                      name="backpack.collectedMice"
                      // tslint:disable-next-line:jsx-no-lambda
                      render={arrayHelpers => (
                        <div>
                          {
                            values.backpack!.collectedMice.length > 0 && (
                            values.backpack!.collectedMice.map((mouse, index) => (
                              <div key={index} className="backpack-item">
                                <span className="mouse-title">Mouse {index + 1}:</span>
                                <label>
                                  Sex
                                  <Field name={`backpack.collectedMice.${index}.sex`} as="select">
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                  </Field>
                                </label>
                                <label>
                                  Genotype
                                  <Field name={`backpack.collectedMice.${index}.genotype`} as="select">
                                    <option value="RR">RᴰRᴰ (brown)</option>
                                    <option value="RC">RᴰRᴸ (tan)</option>
                                    <option value="CR">RᴸRᴰ (tan)</option>
                                    <option value="CC">RᴸRᴸ (white)</option>
                                  </Field>
                                </label>
                                <span className="icon-button delete-mouse">
                                  <svg className="icon"
                                      onClick={() => arrayHelpers.remove(index)}>
                                    <title>Delete mouse from backpack</title>
                                    <use xlinkHref="#icon-delete" />
                                  </svg>
                                </span>
                              </div>
                            )))}
                            <button className="nice-button" type="button"
                                disabled={values.backpack!.collectedMice.length >= 6 }
                                onClick={() => arrayHelpers.push({sex: "female", genotype: "RR"})}>
                              <svg className="icon">
                                <use xlinkHref="#icon-add" />
                              </svg>
                              <span>Add Mouse</span>
                            </button>
                        </div>
                      )}
                    />
                  </div>
                </div>
                { values.ui!.showPopulationSpace &&
                  <div className="section level population">
                    <h2>Population Level</h2>
                    <h3>Population Level Instructions</h3>
                    <div className="instruction">
                      Optional: Add instructions for this level to be displayed in the right-hand panel of the
                      simulation.
                    </div>
                    <Field name="populations.instructions" as="textarea"
                      placeholder="Add instructions..."
                    />
                    <div className="formatting-help">
                      <div className="toggle-help" onClick={handleToggleFormatting(0)}>
                        { showingFormattingHelp[0] ? "Hide formatting help" : "Formatting help" }
                      </div>
                      { showingFormattingHelp[0] && formattingHelp() }
                    </div>
                    <h3>Environment and Hawks</h3>
                    <label>
                      <Field type="checkbox" name="populations.showSwitchEnvironmentsButton" />
                      Enable <b>Change environment</b> button
                    </label>
                    <label className="inset">
                      <Field type="checkbox" name="populations.includeNeutralEnvironment"
                        disabled={!values.populations!.showSwitchEnvironmentsButton} />
                      Include mixed environment option
                    </label>
                    <label>
                      Initial environment displayed
                      <Field name="populations.environment" as="select">
                        <option value="white">Beach</option>
                        <option value="neutral">Mixed</option>
                        <option value="brown">Field</option>
                      </Field>
                    </label>
                    {errors.cantStartWithNeutralIfHidden ? error(errors.cantStartWithNeutralIfHidden as string) : null}
                    <label>
                      Number of hawks
                      <Field name="populations.numHawks"
                        type="number"
                        min="0"
                        max="10"
                      />
                      <span className="instruction">(0-10)</span>
                    </label>
                    {errors.numHawks ? error(errors.numHawks as string) : null}
                    <h3>Initial Mouse Population</h3>
                    <div className="instruction">
                      Set the percentage of each color of mouse in the initial population. Note that the percentage of
                      dark brown mice will always fill the remainder to add up to 100%.
                    </div>
                    <label className="initial-population">
                      <div className="color-swatch light" />
                      <span>Light brown mice</span>
                      <Field name="populations.initialPopulation.white"
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                      />
                      %
                    </label>
                    <label className="initial-population">
                      <div className="color-swatch medium" />
                      <span>Medium brown mice</span>
                      <Field name="populations.initialPopulation.tan"
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                      />
                      %
                    </label>
                    <label className="initial-population disabled">
                      <div className="color-swatch dark" />
                      <span>Dark brown mice</span>
                      <Field disabled={true}
                        type="number"
                        value={
                          Math.max(0, Math.round(
                            (100 - (values.populations!.initialPopulation!.white!
                              + values.populations!.initialPopulation!.tan!))
                            * 100
                          ) / 100)
                        }
                      />
                      %
                    </label>
                    {errors.initialPopulation ? error(errors.initialPopulation as string) : null}
                    <h3>Genotype Labeling</h3>
                    <label>
                      <Field type="checkbox" name="populations.showInspectGenotype" />
                      Show mouse genotype in the Inspect View
                    </label>
                    <h3>Offspring: Inheritance and Mutations</h3>
                    <label>
                      <Field type="checkbox" name="populations.inheritance.breedWithInheritance" />
                      Breed with inheritance
                    </label>
                    <div className="instruction nested-instruction">
                      <b>Selected:</b> Parents pass their genes for fur color to their offspring.<br/>
                      <b>Unselected:</b> All offspring have random phenotypes.
                    </div>
                    <label>
                      <Field type="checkbox" name="populations.inheritance.showStudentControlOfInheritance" />
                      Enable <b>Inheritance</b> checkbox
                    </label>
                    <div className="instruction nested-instruction">
                      Allows for inheritance to be turned on/off in the simulation
                    </div>
                    <hr />
                    <label>
                      <Field type="checkbox" name="populations.inheritance.breedWithMutations" />
                      Breed with mutations
                    </label>
                    <div className="instruction nested-instruction">
                      <b>Selected:</b> Mutations may randomly occur in offspring, and are passed down.<br/>
                      <b>Unselected:</b> No mutations occur.
                    </div>
                    <label>
                      <Field type="checkbox" name="populations.inheritance.showStudentControlOfMutations" />
                      Enable <b>Mutations</b> checkbox
                    </label>
                    <div className="instruction nested-instruction">
                      Allows for mutations to be turned on/off in the simulation
                    </div>
                    <label className={(!values.populations!.inheritance!.breedWithMutations! &&
                        !values.populations!.inheritance!.showStudentControlOfMutations!) ? "disabled" : ""}>
                      Chance of mutations
                      <Field name="populations.inheritance.chanceOfMutations"
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        disabled={(!values.populations!.inheritance!.breedWithMutations! &&
                          !values.populations!.inheritance!.showStudentControlOfMutations!)}
                      />
                      %&nbsp;
                      <span className="instruction">(0-100)</span>
                    </label>
                    {errors.popChanceOfMutations ? error(errors.popChanceOfMutations as string) : null}
                    <h3>Data Graphs</h3>
                    <div className="instruction">
                      Select the graphs that can be displayed in the simulation. At least one graph must be shown.
                    </div>
                    <label>
                      <Field type="checkbox" name="populations.enableColorChart" />
                      Enable <b>Fur Colors</b> graph button
                    </label>
                    <label>
                      <Field type="checkbox" name="populations.enableGenotypeChart" />
                      Enable <b>Genotypes</b> graph button
                    </label>
                    <label>
                      <Field type="checkbox" name="populations.enableAllelesChart" />
                      Enable <b>Alleles</b> graph button
                    </label>
                    {errors.onePopulationChart ? error(errors.onePopulationChart as string) : null}
                    <label>
                      <Field type="checkbox" name="populations.enablePieChart" />
                      Show <b>Pie Charts</b> button
                    </label>
                  </div>
                }
                { values.ui!.showOrganismSpace &&
                  <div className="section level organism">
                    <h2>Organism Level</h2>
                    <h3>Organism Level Instructions</h3>
                    <div className="instruction">
                      Optional: Add instructions for this level to be displayed in the right-hand panel of the
                      simulation.
                    </div>
                    <Field name="organisms.instructions" as="textarea"
                      placeholder="Add instructions..."
                    />
                    <div className="formatting-help">
                      <div className="toggle-help" onClick={handleToggleFormatting(1)}>
                        { showingFormattingHelp[1] ? "Hide formatting help" : "Formatting help" }
                      </div>
                      { showingFormattingHelp[1] && formattingHelp() }
                    </div>
                    <h3>Cell and Substance Labels</h3>
                    <div className="instruction">
                      Select to replace scientific names with masked labels.
                    </div>
                    <label>
                      <Field type="checkbox" name="organisms.useMysteryOrganelles" />
                      Show masked labels for the parts of the cell
                    </label>
                    <div className="instruction nested-instruction">
                      For example, "Golgi" will be replaced with "Location 1."
                    </div>
                    <label>
                      <Field type="checkbox" name="organisms.useMysterySubstances" />
                      Show masked labels for substances
                    </label>
                    <div className="instruction nested-instruction">
                      For example, "Pheomelanin" will be replaced with "Substance A."
                    </div>
                    <h3>Additional Investigations: Receptor Proteins and Nucleus</h3>
                    <label>
                      <Field type="checkbox" name="organisms.showZoomToReceptor" />
                      Enable <b>Target Zoom</b> button to the cell membrane
                    </label>
                    <div className="instruction nested-instruction">
                      Allows for further investigation of the receptor proteins
                    </div>
                    <label>
                      <Field type="checkbox" name="organisms.showZoomToNucleus" />
                      Enable <b>Target Zoom</b> button to the nucleus
                    </label>
                    <div className="instruction nested-instruction">
                      Allows for further investigation of the chromosomes
                    </div>
                  </div>
                }
                { values.ui!.showBreedingSpace &&
                  <div className="section level breeding">
                    <h2>Heredity Level</h2>
                    <h3>Heredity Level Instructions</h3>
                    <div className="instruction">
                      Optional: Add instructions for this level to be displayed in the right-hand panel of the
                      simulation.
                    </div>
                    <Field name="breeding.instructions" as="textarea"
                      placeholder="Add instructions..."
                    />
                    <div className="formatting-help">
                      <div className="toggle-help" onClick={handleToggleFormatting(2)}>
                        { showingFormattingHelp[2] ? "Hide formatting help" : "Formatting help" }
                      </div>
                      { showingFormattingHelp[2] && formattingHelp() }
                    </div>
                    <h3>Offspring: Mutations</h3>
                    <label>
                      <Field type="checkbox" name="breeding.breedWithMutations" />
                      Breed with mutations
                    </label>
                    <div className="instruction nested-instruction">
                      <b>Selected:</b> Mutations may randomly occur in offspring, and are passed down.<br/>
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
                    {errors.breedingChanceOfMutations ? error(errors.breedingChanceOfMutations as string) : null}
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
                      Enable <b>Fur Colors</b> graph button
                    </label>
                    <label>
                      <Field type="checkbox" name="breeding.enableGenotypeChart" />
                      Enable <b>Genotypes</b> graph button
                    </label>
                    <label>
                      <Field type="checkbox" name="breeding.enableSexChart" />
                      Enable <b>Sex</b> graph button
                    </label>
                    {errors.oneBreedingChart ? error(errors.oneBreedingChart as string) : null}
                  </div>
                }
                <hr />
                <div className="submit">
                  <button className="nice-button"  type="submit"
                      disabled={modelUrl !== "" || Object.keys(errors).length > 0}>
                    <svg className="icon">
                      <use xlinkHref="#icon-submit" />
                    </svg>
                    Publish & Preview
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

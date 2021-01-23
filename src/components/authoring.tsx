import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./authoring.sass";
import Form, { ISubmitEvent } from "react-jsonschema-form";
import { QueryParams } from "../utilities/url-params";
import { JSONSchema6 } from "json-schema";
import * as authoringSchema from "../authoring-schema.json";
import { ConnectedBioAuthoring } from "../authoring";
import { ConnectedBioModelCreationType } from "../models/stores";

interface IProps extends IBaseProps {
  initialAuthoring: ConnectedBioModelCreationType;
}
interface IState {}

export const defaultAuthoring: ConnectedBioAuthoring = {
  unit: "mouse",
  topBar: true,
  ui: {
    showPopulationSpace: true,
    showBreedingSpace: true,
    showOrganismSpace: true,
    showDNASpace: true,
    investigationPanelSpace: "none"
  },
  backpack: {
    collectedMice: []
  },
  populations: {
    instructions: "",
    environment: "white",
    showSwitchEnvironmentsButton: true,
    includeNeutralEnvironment: true,
    showInspectGenotype: true,
    initialPopulation: {
      white: 33.33,
      tan: 33.33
    },
    numHawks: 2,
    inheritance: {
      showStudentControlOfMutations: false,
      breedWithMutations: false,
      chanceOfMutations: 2,
      showStudentControlOfInheritance: false,
      breedWithInheritance: true,
      randomOffspring: {
        white: 33.33,
        tan: 33.33
      }
    },
    deadMice: {
      chanceOfShowingBody: 50,
      timeToShowBody: 50
    },
    enableColorChart: true,
    enableGenotypeChart: true,
    enableAllelesChart: true,
    enablePieChart: true,
  },
  organisms: {
    instructions: "",
    useMysteryOrganelles: false,
    useMysterySubstances: false,
    showZoomToReceptor: true,
    showZoomToNucleus: true
  },
  breeding: {
    instructions: "",
    enableStudentControlOfMutations: false,
    breedWithMutations: false,
    chanceOfMutations: 2,
    enableInspectGametes: true,
    enableColorChart: true,
    enableGenotypeChart: true,
    enableSexChart: true
  }
};

const uiSchema = {
  backpack: {
    "ui:options": {
      addable: true,
      orderable: true,
      removable: true
    },
  },
  populations: {
    instructions: {
      "ui:widget": "textarea"
    },
    initialPopulation: {
      classNames: "minor-group",
      tan: {
        "ui:help": "Brown will be remainder"
      }
    },
    inheritance: {
      breedWithMutations: {
        "ui:help": "Whether the model starts with mutations"
      },
      chanceOfMutations: {
        "ui:help": "When either 'Breed with mutations' or 'Student control' is true"
      },
      breedWithInheritance: {
        "ui:help": "Whether the model starts with inheritance"
      },
      randomOffspring: {
        classNames: "minor-group",
        tan: {
          "ui:help": "Brown will be the remainder"
        }
      }
    }
  },
  organisms: {
    instructions: {
      "ui:widget": "textarea"
    }
  },
  breeding: {
    instructions: {
      "ui:widget": "textarea"
    }
  }
};

export class AuthoringComponent extends BaseComponent<IProps, IState> {
  public render() {
    const onSubmit = (e: ISubmitEvent<QueryParams>) => {
      const authoredForm = e.formData;
      delete authoredForm.authoring;
      const encodedParams = encodeURIComponent(JSON.stringify(authoredForm));
      window.open(`${location.origin}${location.pathname}?${encodedParams}`, "connected-bio-spaces");
    };
    return (
      <div className="authoring">
        <Form
          schema={authoringSchema as JSONSchema6}
          formData={this.props.initialAuthoring}
          uiSchema={uiSchema}
          onSubmit={onSubmit} />
      </div>
    );
  }
}

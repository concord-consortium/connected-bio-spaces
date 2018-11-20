import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./authoring.sass";
import Form, { ISubmitEvent } from "react-jsonschema-form";
import { QueryParams } from "../utilities/url-params";
import { JSONSchema6 } from "json-schema";

interface IProps extends IBaseProps {}
interface IState {}

const schema: JSONSchema6 = {
  title: "Connected Bio Parameters",
  type: "object",
  properties: {
    curriculum: {
      title: "Unit",
      type: "string",
      oneOf: [
        { enum: ["mouse"], title: "Mouse" }
      ]
    },
    topBar: {type: "boolean", title: "Show Top Bar"},
    populations: {
      title: "Populations Model",
      type: "object",
      properties: {
        initialEnvironment: {
          title: "Initial environment",
          type: "string",
          enum: [
            "white",
            "neutral",
            "brown"
          ],
          enumNames: [
            "White",
            "Neutral",
            "Brown"
          ]
        },
        showSwitchEnvironmentsButton: {
          title: "Show switch environments button",
          type: "boolean"
        },
        includeNeutralEnvironment: {
          title: "Include neutral environment",
          type: "boolean"
        },
        initialPopulation: {
          title: "Initial mouse population",
          type: "object",
          properties: {
            white: {
              title: "White (%)",
              type: "number"
            },
            tan: {
              title: "Tan (%)",
              type: "number"
            }
          }
        },
        numHawks: {
          title: "Number of hawks",
          type: "number"
        },
        inheritance: {
          title: "Inheritance",
          type: "object",
          properties: {
            showStudentControlOfMutations: {
              title: "Show student mutation control",
              type: "boolean"
            },
            breedWithMutations: {
              title: "Breed with mutations",
              type: "boolean"
            },
            chanceOfMutations: {
              title: "Chance of mutations (%)",
              type: "number"
            },
            showStudentControlOfInheritance: {
              title: "Show student inheritance control",
              type: "boolean"
            },
            breedWithoutInheritance: {
              title: "Breed without inheritance",
              type: "boolean"
            },
            randomOffspring: {
              title: "Proportions of random offspring when breeding without inheritance",
              type: "object",
              properties: {
                white: {
                  title: "White (%)",
                  type: "number"
                },
                tan: {
                  title: "Tan (%)",
                  type: "number"
                }
              }
            }
          }
        }
      }
    }
  }
};

export const defaultAuthoring = {
  curriculum: "mouse",
  topBar: true,
  populations: {
    initialEnvironment: "white",
    showSwitchEnvironmentsButton: true,
    includeNeutralEnvironment: true,
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
      breedWithoutInheritance: false,
      randomOffspring: {
        white: 0,
        tan: 0
      }
    }
  }
};

const uiSchema = {
  curriculum: {
    "ui:readonly": true
  },
  populations: {
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
      breedWithoutInheritance: {
        "ui:help": "Whether the model starts without inheritance"
      },
      randomOffspring: {
        classNames: "minor-group",
        tan: {
          "ui:help": "Brown will be the remainder"
        }
      }
    }
  }
};

export class AuthoringComponent extends BaseComponent<IProps, IState> {
  public render() {
    const onSubmit = (e: ISubmitEvent<QueryParams>) => {
      const encodedParams = encodeURIComponent(JSON.stringify(e.formData));
      window.open(`${location.origin}${location.pathname}?${encodedParams}`, "connected-bio-spaces");
    };
    return (
      <div className="authoring">
        <Form
          schema={schema}
          formData={defaultAuthoring}
          uiSchema={uiSchema}
          onSubmit={onSubmit} />
      </div>
    );
  }
}

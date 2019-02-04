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
    ui: {
      title: "Investigation Spaces",
      type: "object",
      properties: {
        showPopulationSpace: {type: "boolean", title: "Show Populations Space"},
        showBreedingSpace: {type: "boolean", title: "Show Breeding Space"},
        showOrganismSpace: {type: "boolean", title: "Show Organism Space"},
        showDNASpace: {type: "boolean", title: "Show DNA/Protein Space"},
        investigationPanelSpace: {
          title: "Initial displayed space",
          type: "string",
          enum: [
            "none",
            "populations",
            "breeding",
            "organism",
            "dna"
          ],
          enumNames: [
            "none",
            "Populations",
            "Breeding",
            "Organism",
            "DNA"
          ]
        },
      }
    },
    backpack: {
      type: "object",
      title: "Initial backpack",
      properties: {
        collectedMice: {
          title: "",
          type: "array",
          maxItems: 6,
          default: [],
          items: {
            type: "object",
            properties: {
              sex: {
                title: "Sex",
                type: "string",
                enum: [
                  "female",
                  "male"
                ],
                enumNames: [
                  "Female",
                  "Male"
                ],
                default: "female"
              },
              genotype: {
                title: "Genotype",
                type: "string",
                enum: [
                  "RR",
                  "RC",
                  "CR",
                  "CC"
                ],
                enumNames: [
                  "RR (brown)",
                  "RC (tan)",
                  "CR (tan)",
                  "CC (white)"
                ],
                default: "RR"
              }
            }
          }
        }
      }
    },
    populations: {
      title: "Populations Model",
      type: "object",
      properties: {
        instructions: {
          title: "Instructions (as markdown)",
          type: "string"
        },
        environment: {
          title: "Initial environment",
          type: "string",
          enum: [
            "white",
            "neutral",
            "brown"
          ],
          enumNames: [
            "Beach",
            "Mixed",
            "Field"
          ]
        },
        showSwitchEnvironmentsButton: {
          title: "Enable change environments button",
          type: "boolean"
        },
        includeNeutralEnvironment: {
          title: "Include mixed environment",
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
              title: "Enable student mutation control",
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
              title: "Enable student inheritance control",
              type: "boolean"
            },
            breedWithInheritance: {
              title: "Breed with inheritance",
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
    },
    organism: {
      title: "Organism Model",
      type: "object",
      properties: {
        instructions: {
          title: "Instructions (as markdown)",
          type: "string"
        }
      }
    }
  }
};

export const defaultAuthoring = {
  curriculum: "mouse",
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
    }
  },
  organism: {
    instructions: ""
  }

};

const uiSchema = {
  curriculum: {
    "ui:readonly": true
  },
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
  organism: {
    instructions: {
      "ui:widget": "textarea"
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

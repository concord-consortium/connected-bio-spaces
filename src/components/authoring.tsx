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
    topBar: {type: "boolean", title: "Show Top Bar?"},
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
    initialPopulation: {
      white: 33.33,
      tan: 33.33
    },
    numHawks: 2
  }
};

const uiSchema = {
  curriculum: {
    "ui:readonly": true
  },
  populations: {
    initialPopulation: {
      tan: {
        "ui:help": "Brown will be remainder"
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

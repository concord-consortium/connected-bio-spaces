import * as React from "react";
import { BaseComponent, IBaseProps } from "./base";

import "./app.sass";
import Form, { ISubmitEvent } from "react-jsonschema-form";
import { AppMode } from "../models/stores";
import { QueryParams } from "../utilities/url-params";

interface IProps extends IBaseProps {}
interface IState {}

export class AuthoringComponent extends BaseComponent<IProps, IState> {
  public render() {
    const onSubmit = (e: ISubmitEvent<QueryParams>) => {
      const encodedParams = encodeURIComponent(JSON.stringify(e.formData));
      window.open(`${location.origin}${location.pathname}?${encodedParams}`, "connected-bio-spaces");
    };
    return (
      <div className="authoring">
        <Form
          schema={{
            title: "Connected Bio Parameters",
            type: "object",
            properties: {
              topBar: {type: "boolean", title: "Show Top Bar?", default: true},
              appMode: {type: "string", title: "App Mode", default: "dev", enum: [
                "dev",
                "authed"
              ]}
            }
          }}
          onSubmit={onSubmit} />
      </div>
    );
  }
}

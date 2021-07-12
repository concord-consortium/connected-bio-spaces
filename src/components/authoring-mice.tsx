import * as React from "react";
import { Formik, Form, Field, FormikState, FormikHelpers } from "formik";
import { ConnectedBioModelCreationType } from "../models/stores";

import "./formik-authoring.sass";

interface IProps {
  initialAuthoring: ConnectedBioModelCreationType;
}

export const MiceAuthoringComponent: React.FC<IProps> = ({initialAuthoring}) => {
  const onSubmit = (values: ConnectedBioModelCreationType, actions: FormikHelpers<ConnectedBioModelCreationType>) => {
    delete values.authoring;
    const encodedParams = encodeURIComponent(JSON.stringify(values));
    window.open(`${location.origin}/index.html?${encodedParams}`, "connected-bio-spaces");
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
      <div className="right-column">
        <div className="authoring-header">
          <h1>Connected Bio Authoring: Mouse Unit Settings</h1>
        </div>
        <div className="form-body">
          <Formik
            initialValues={initialAuthoring}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }: FormikState<ConnectedBioModelCreationType>) => (
              <Form>
                <div>
                  <h2>Explore Levels</h2>
                  <div>
                    Set the levels to be displayed in the simulation. Note that at least one level needs to
                    be selected.
                  </div>
                  <label>
                    <Field type="checkbox" name="ui.showPopulationSpace" />
                    Show <b>Population</b> level
                  </label>
                </div>
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

import { inject, observer } from "mobx-react";
import * as React from "react";
import Markdown from "markdown-to-jsx";
import { BaseComponent, IBaseProps } from "./base";

import "./instructions.sass";

interface IProps extends IBaseProps {
  content: string;
}
interface IState {}

@inject("stores")
@observer
export class InstructionsComponent extends BaseComponent<IProps, IState> {

  public render() {
    return (
      <Markdown className="authored-markdown">
        {this.props.content}
      </Markdown>
    );
  }
}

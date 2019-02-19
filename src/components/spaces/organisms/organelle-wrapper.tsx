import * as React from "react";
import { IReactionDisposer, observable } from "mobx";
import { observer, inject } from "mobx-react";
// import { IOrganism, OrganelleRef } from "../models/Organism";
// import { OrganelleType, mysteryOrganelleNames } from "../models/Organelle";
// import { View, appStore } from "../stores/AppStore";
// import { rootStore, Mode } from "../stores/RootStore";
import { createModel } from "organelle";
import * as Cell from "./cell-models/cell.json";
import * as Receptor from "./cell-models/receptor.json";
import { kOrganelleInfo } from "../../../models/spaces/organisms/organisms-space";
import { BaseComponent } from "../../base";
// import { SubstanceType } from "../models/Substance";
import "./organelle-wrapper.sass";
import { ModeType, ZoomLevelType } from "../../../models/spaces/organisms/organisms-row.js";
import { OrganelleType } from "../../../models/spaces/organisms/organisms-mouse.js";

interface OrganelleWrapperProps {
  zoomLevel: ZoomLevelType;
  elementName: string;
  rowIndex: number;
  width: number;
  mode: ModeType;
}

interface OrganelleWrapperState {
  hoveredOrganelle: any;
  dropperCoords: any;
}

const SUBSTANCE_ADDITION_MS = 3500;
const MODEL_HEIGHT = 362;
const MODEL_WIDTH = 580;

type SelectorInfo = {
  [key in OrganelleType]: {
    selector: string,
    opaqueSelector?: string,
    visibleModes?: ModeType[]
  }
};

@inject("stores")
@observer
export class OrganelleWrapper extends BaseComponent<OrganelleWrapperProps, OrganelleWrapperState> {
    private disposers: IReactionDisposer[] = [];
    private model: any;
    private organelleSelectorInfo: SelectorInfo = {
      nucleus: {
        selector: "#nucleus",
        visibleModes: ["normal"]
      },
      cytoplasm: {
        selector: `#cytoplasm`,
        opaqueSelector: "#cellshape_0_Layer0_0_FILL, #intercell_zoom_bounds"
      },
      golgi: {
        selector: "#golgi_x5F_apparatus",
        visibleModes: ["normal"]
      },
      extracellular: {
        selector: `#intercell`,
        opaqueSelector: "#Layer6_0_FILL"
      },
      melanosome: {
        selector: "#melanosome_2, #melanosome_4"
      },
      receptor: {
        selector: ".receptor-group",
        visibleModes: ["normal"]
      },
      receptorWorking: {
        selector: ".receptor-working",
        visibleModes: ["inspect"]
      },
      receptorBroken: {
        selector: ".receptor-broken",
        visibleModes: ["inspect"]
      },
      gate: {
        selector: ".gate-a, .gate-b, .gate-c, .gate-d",
        visibleModes: ["normal"]
      },
      nearbyCell: {
        selector: "#other_cells",
        opaqueSelector: "#backcell_x5F_color",
        visibleModes: ["normal"]
      }
    };
  private modelDomRef: React.RefObject<{}>|null;
  private setModelDomRef: (element: any) => void;

  constructor(props: OrganelleWrapperProps) {
    super(props);
    this.state = {
      hoveredOrganelle: null,
      dropperCoords: []
    };
    this.completeLoad = this.completeLoad.bind(this);
    this.resetHoveredOrganelle = this.resetHoveredOrganelle.bind(this);

    this.modelDomRef = null;
    this.setModelDomRef = (element) => {
      this.modelDomRef = element;
    };
  }

  public componentDidMount() {
    this.createNewModel();
  }

  public componentWillReact() {
    const { zoomLevel, mode } = this.props;
    if (this.model) {
      if (zoomLevel !== this.model.zoomLevel) {
        this.createNewModel();
      }

      if (mode !== this.model.mode) {
        this.model.mode = mode;
        if (mode === "normal") {
          this.model.run();
        } else {
          this.model.stop();
        }
      }
    }

  }

  public componentWillUnmount() {
    this.disposers.forEach(disposer => disposer());
    this.getModel().destroy();
    // appStore.boxes.get(this.props.boxId).setModel(null);
  }

  public organelleClick(organelleType: OrganelleType, location: {x: number, y: number}) {
    const { organisms } = this.stores;
    const row = organisms.rows[this.props.rowIndex];
    if (row.mode === "assay") {
      row.setActiveAssay(organelleType);
      row.setRightPanel("data");        // auto-switch to data
      row.setMode("normal");
    } else if (row.mode === "inspect" &&
        (organelleType === "receptorWorking" || organelleType === "receptorBroken")) {
      row.setSelectedOrganelle(organelleType);
      row.setRightPanel("information"); // auto-switch to info
      row.setMode("normal");
    } else if (row.mode === "add" && row.organismsMouse) {
      const substance = row.selectedSubstance;
      row.organismsMouse.addSubstance(organelleType, substance, 100);
      row.setMode("normal");

      if (substance === "hormone") {
        this.addHormone(organelleType, location);
      } else if (substance === "signalProtein") {
        this.addSignalProtein(organelleType, location);
      }
    }
    // if (rootStore.mode === Mode.Assay) {
    //   const organelleInfo = OrganelleRef.create({
    //     organism,
    //     organelleType
    //   });
    //   rootStore.setActiveAssay(organelleInfo);
    // } else if (rootStore.mode === Mode.Add || rootStore.mode === Mode.Subtract) {
    //   // update substance levels
    //   rootStore.changeSubstanceLevel(OrganelleRef.create({ organism, organelleType }));
    //   // show animation in model
    //   const substanceType = rootStore.activeSubstance;
    // }
  }

  public addAgentsOverTime(species: string, state: string, props: object, countAtOnce: number, times: number) {
    const period = SUBSTANCE_ADDITION_MS / times;
    const addAgents = (model: any) => {
      for (let i = 0; i < countAtOnce; i++) {
        const a = model.world.createAgent(model.world.species[species]);
        a.state = state;
        a.setProperties(props);
      }
    };

    const addAgentsAgent = (model: any, added: number) => {
      addAgents(model);
      if (added < times) {
        model.setTimeout(addAgentsAgent.bind(this, model, added + 1), period);
      }
    };

    addAgentsAgent(this.model, 0);

    // const matchingBoxes = Object.keys(appStore.boxes.toJS())
    //   .map((key) => appStore.boxes.get(key))
    //   .filter((otherBox: any) => {
    //     return (
    //       otherBox.organism.id === appStore.getBoxOrganism(this.props.boxId).id &&
    //       (otherBox.viewType === View.Cell || otherBox.viewType === View.Protein)
    //     );
    // });

    // matchingBoxes.forEach((box) => addAgentsAgent(box.model, 0));
  }

  public addHormone(organelleType: OrganelleType, location: {x: number, y: number}) {
    const { rowIndex } = this.props;
    const { organisms } = this.stores;
    const zoom = organisms.rows[rowIndex].zoomLevel;
    const species = zoom === "cell" ? "hormoneDot" : "hexagon";
    const inIntercell = organelleType === "extracellular";
    const state = inIntercell ? "find_path_from_anywhere" : "diffuse";
    const props = inIntercell ? location : {speed: 0.4, x: location.x, y: location.y};
    const count = inIntercell ? 3 : 2;
    this.addAgentsOverTime(species, state, props, count, 9);
  }

  public addSignalProtein(organelleType: OrganelleType, location: {x: number, y: number}) {
    const inIntercell = organelleType === "extracellular";
    const species = "gProteinPart";
    const state = inIntercell ? "find_flowing_path" : "in_cell_from_click";
    this.addAgentsOverTime(species, state, location, 1, 9);
  }

  public render() {
    const {organisms} = this.stores;
    const {mode, zoomLevel} = this.props;
    const {getOrganelleLabel} = organisms;
    // const hoverLabel = appStore.mysteryLabels ?
    //   mysteryOrganelleNames[this.state.hoveredOrganelle] : this.state.hoveredOrganelle;
    const hoveredOrganelle = organisms.rows[this.props.rowIndex].hoveredOrganelle;
    const hoverLabel = hoveredOrganelle ? getOrganelleLabel(hoveredOrganelle) : undefined;
    const hoverDiv = hoverLabel
      ? (
        <div className="hover-location" data-test="hover-label">
          {hoverLabel}
        </div>)
      : null;

    let cursorClass: string = mode;
    const substance = organisms.rows[this.props.rowIndex].selectedSubstance;
    cursorClass = cursorClass + (mode === "add" ? "-" + substance : "");
    if (zoomLevel !== "protein" && cursorClass === "inspect") {
      cursorClass = "";
    }
    if (!hoveredOrganelle || (mode === "inspect" && !hoveredOrganelle.includes("receptor"))) {
      cursorClass += "-disabled";
    }

    const droppers: any = this.state.dropperCoords.map((dropperCoord: any, i: number) => (
      <div className="temp-dropper" key={i} style={{left: dropperCoord.x - 9, top: dropperCoord.y - 41}}>
        <img src={"assets/cell-zoom/add-" + substance + "-cursor.png"} width="43px" data-test="dropper"/>
      </div>
    ));
    const width = this.props.width ? Math.min(this.props.width, MODEL_WIDTH) : MODEL_WIDTH;
    const style = {height: MODEL_HEIGHT, width};
    return (
      <div
        className={"model-wrapper " + cursorClass}
        style={style}
        onClick={this.forceDropper}
        onMouseUp={this.forceDropper}
        onMouseDown={this.forceDropper}
        onMouseMove={this.forceDropper}
      >
        <div id={this.props.elementName} className="model" onMouseLeave={this.resetHoveredOrganelle}
          ref={this.setModelDomRef} />
        {hoverDiv}
        {droppers}
      </div>
    );
  }

  private createNewModel() {
    if (this.model) {
      this.model.destroy();
      if (this.modelDomRef) {
        ((this.modelDomRef as unknown) as Element).innerHTML = "";
      }
    }
    const { zoomLevel } = this.props;
    const { organisms } = this.stores;
    const row = organisms.rows[this.props.rowIndex];
    const { organismsMouse } = row;
    const { modelProperties } = organismsMouse!;
    const modelDef: any = zoomLevel === "cell" ? Cell : Receptor;

    modelDef.container = {
      elId: this.props.elementName,
      width: this.props.width ? Math.min(this.props.width, MODEL_WIDTH) : MODEL_WIDTH,
      height: MODEL_HEIGHT
    };

    modelDef.properties = modelProperties;

    createModel(modelDef).then((m: any) => {
      this.model = m;
      this.model.zoomLevel = zoomLevel;
      this.model.mode = row.mode;
      this.setState({dropperCoords: []});
      this.completeLoad();
    });
  }

  private forceDropper(e: any) {
    // Hack to force Fabric canvases to inherit cursor styles, should configure in Organelle instead
    if (typeof e.target.className === "string" && e.target.className.indexOf("upper-canvas") > -1) {
      e.target.style.cursor = "inherit";
    }
  }

  private getModel() {
    // return appStore.boxes.get(this.props.boxId).model;
    return this.model;
  }

  private completeLoad() {
    const model = this.getModel();
    model.on("view.loaded", () => {
      this.updateReceptorImage();
    });

    if (this.props.zoomLevel === "protein") {
      model.setTimeout(
        () => {
          for (let i = 0; i < 3; i++) {
            // The world could have been unmounted since the timeout was set
            if (model && model.world) {
              model.world.createAgent(model.world.species.gProtein);
            }
          }
        },
        1300);
    }

    model.on("hexagon.notify", () => this.updateReceptorImage());

    model.on("gProtein.notify", (evt: any) => {
      const proteinToBreak = evt.agent;
      const location = {x: proteinToBreak.getProperty("x"), y: proteinToBreak.getProperty("y")};
      const body = model.world.createAgent(model.world.species.gProteinBody);
      body.setProperties(location);

      const part = model.world.createAgent(model.world.species.gProteinPart);
      part.setProperties(location);

      proteinToBreak.die();

      if (evt.message === "break_time_1") {
        model.world.setProperty("g_protein_1_bound", false);
      } else {
        model.world.setProperty("g_protein_2_bound", false);
        body.setProperties({second_receptor: true});
      }

      model.world.createAgent(model.world.species.gProtein);
    });

    model.on("model.step", () => {
      const { organisms } = this.stores;
      const { rowIndex } = this.props;
      const { organismsMouse } = organisms.rows[rowIndex];
      if (!organismsMouse) {
        return;
      }
      const percentDarkness = organismsMouse.getPercentDarkness();

      // go from lightest to darkest in HSL space, which provides the best gradual transition

      // lightest brown: rgb(244, 212, 141) : hsl(41°, 82%, 75%)
      // darkest brown:  rgb(124, 81, 21)   : hsl(35°, 71%, 28%)
      const light = [41, 82, 75];
      const dark = [35, 71, 28];
      const color = light.map( (c, i) => Math.round(c + (dark[i] - c) * (percentDarkness / 100)) );
      const colorStr = `hsl(${color[0]},${color[1]}%,${color[2]}%)`;

      const cellFill = model.view.getModelSvgObjectById("cellshape_0_Layer0_0_FILL");
      if (cellFill) {
        cellFill.setColor(colorStr);
      }

      const modelProperties: any = organismsMouse.modelProperties;
      if (model) {
        Object.keys(modelProperties).forEach((key: string) => {
          this.getModel().world.setProperty(key, modelProperties[key]);
        });
      }

      // set lightness on model object so it can change organism image
      // organism.setCellLightness(percentLightness);
    });

    model.on("view.hover.enter", (evt: any) => {
      const {organisms} = this.stores;
      const hoveredOrganelle = this.getOrganelleFromMouseEvent(evt);
      organisms.rows[this.props.rowIndex].setHoveredOrganelle(hoveredOrganelle);
    });

    model.on("view.click", (evt: any) => {
      const clickTarget = this.getOrganelleFromMouseEvent(evt);
      if (clickTarget) {
        // Keep the dropper displayed for substance additions
        const { mode } = this.props;
        if (mode === "add") {
          const newCoords = this.state.dropperCoords.slice(0);
          newCoords.push({x: evt.e.layerX, y: evt.e.layerY});
          this.setState({dropperCoords: newCoords});
          model.setTimeout(() => {
            const splicedCoords = this.state.dropperCoords.slice(0);
            splicedCoords.splice(0, 1);
            this.setState({dropperCoords: splicedCoords});
          }, SUBSTANCE_ADDITION_MS);
        }

        // Handle the click in the Organelle model
        const location = model.view.transformToWorldCoordinates({x: evt.e.offsetX, y: evt.e.offsetY});
        this.organelleClick(clickTarget, location);
      }
    });
  }

  private updateReceptorImage() {
    const model = this.getModel();
    const { zoomLevel } = this.props;
    if (zoomLevel === "cell") {
      model.view.show(".receptor-mini", true);
      this.hideAllReceptors();
    } else {
      model.view.hide(".receptor-mini", true);
      if (model.world.getProperty("base_darkness") > 0) {
        if (model.world.getProperty("hormone_1_bound")) {
          this.showReceptor(1, "bound");
        } else {
          this.showReceptor(1, "working");
        }

        if (model.world.getProperty("base_darkness") === 1) {
          this.showReceptor(2, "broken");
        } else {
          if (model.world.getProperty("hormone_2_bound")) {
            this.showReceptor(2, "bound");
          } else {
            this.showReceptor(2, "working");
          }
        }
      } else {
        this.showReceptor(1, "broken");
        this.showReceptor(2, "broken");
      }
    }
  }

  private hideAllReceptors() {
    const model = this.getModel();
    model.view.hide("#receptor-working-1", true);
    model.view.hide("#receptor-broken-1", true);
    model.view.hide("#receptor-bound-1", true);
    model.view.hide("#receptor-working-2", true);
    model.view.hide("#receptor-broken-2", true);
    model.view.hide("#receptor-bound-2", true);
  }

  private showReceptor(receptor: number, state: "working" | "bound" | "broken") {
    const model = this.getModel();
    model.view.hide(`#receptor-working-${receptor}`, true);
    model.view.hide(`#receptor-bound-${receptor}`, true);
    model.view.hide(`#receptor-broken-${receptor}`, true);
    model.view.show(`#receptor-${state}-${receptor}`, true);
  }

  private getOrganelleFromMouseEvent(evt: any): OrganelleType | undefined {
    const {organisms} = this.stores;
    const possibleTargets: OrganelleType[] = (Object.keys(this.organelleSelectorInfo) as OrganelleType[])
      .filter(organelle => {
        const organelleInfo = this.organelleSelectorInfo[organelle];
        const visibleModes = organelleInfo.visibleModes;
        return !visibleModes || visibleModes.indexOf(organisms.rows[this.props.rowIndex].mode) > -1;
      });
    return possibleTargets.find((t) => {
      return evt.target._organelle.matches({selector: this.organelleSelectorInfo[t].selector});
    });
  }

  private resetHoveredOrganelle = () => {
    const {organisms} = this.stores;
    const {rowIndex} = this.props;
    organisms.rows[rowIndex].setHoveredOrganelle(undefined);
  }

  private getOpaqueSelector(organelleType: OrganelleType) {
    return this.organelleSelectorInfo[organelleType].opaqueSelector ?
      this.organelleSelectorInfo[organelleType].opaqueSelector :
      this.organelleSelectorInfo[organelleType].selector;
  }
}

export default OrganelleWrapper;

import * as React from "react";
import { autorun, IReactionDisposer, observable } from "mobx";
import { observer, inject } from "mobx-react";
// import { IOrganism, OrganelleRef } from "../models/Organism";
// import { OrganelleType, mysteryOrganelleNames } from "../models/Organelle";
// import { View, appStore } from "../stores/AppStore";
// import { rootStore, Mode } from "../stores/RootStore";
import { createModel } from "organelle";
import * as Cell from "./cell-models/cell.json";
import { OrganelleType, ModeType, kOrganelleInfo } from "../../../models/spaces/cell-zoom/cell-zoom";
import { BaseComponent } from "../../base";
// import { SubstanceType } from "../models/Substance";
import "./OrganelleWrapper.sass";

interface OrganelleWrapperProps {
  elementName: string;
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
        selector: "#receptor-broken, #receptor-working, #receptor-bound",
        visibleModes: ["normal"]
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
    // private modelDefs: any = {
    //   Cell: CellModels.cell,
    //   Protein: CellModels.receptor
    // };

  constructor(props: OrganelleWrapperProps) {
    super(props);
    this.state = {
      hoveredOrganelle: null,
      dropperCoords: []
    };
    this.completeLoad = this.completeLoad.bind(this);
    this.resetHoveredOrganelle = this.resetHoveredOrganelle.bind(this);
  }

  public componentDidMount() {
    // const box = appStore.boxes.get(this.props.boxId);
    // const view = box.viewType;
    // const {organism} = box;
    // const {modelProperties} = organism;
    const modelDef: any = Cell;

    modelDef.container = {
      elId: this.props.elementName,
      width: MODEL_WIDTH,
      height: MODEL_HEIGHT
    };

    const modelProperties: any = {
      albino: false,
      working_tyr1: false,
      working_myosin_5a: true,
      open_gates: false,
      eumelanin: 50,
      hormone_spawn_period: 40,
      working_receptor: true
    };
    modelDef.properties = modelProperties;

    createModel(modelDef).then((m: any) => {
      // appStore.boxes.get(this.props.boxId).setModel(m);
      this.model = m;
      this.completeLoad();
    });

    // Update model properties as they change
    this.disposers.push(autorun(() => {
      if (this.getModel()) {
        Object.keys(modelProperties).forEach((key: string) => {
          this.getModel().world.setProperty(key, modelProperties[key]);
        });
      }
    }));
  }

  public componentWillUnmount() {
    this.disposers.forEach(disposer => disposer());
    this.getModel().destroy();
    // appStore.boxes.get(this.props.boxId).setModel(null);
  }

  public updateReceptorImage() {
    const model = this.getModel();
    if (model.world.getProperty("working_receptor")) {
      model.view.hide("#receptor-broken", true);
      if (model.world.getProperty("hormone_bound")) {
        model.view.hide("#receptor-working", true);
        model.view.show("#receptor-bound", true);
      } else {
        model.view.show("#receptor-working", true);
        model.view.hide("#receptor-bound", true);
      }
    } else {
      model.view.hide("#receptor-working", true);
      model.view.hide("#receptor-bound", true);
      model.view.show("#receptor-broken", true);
    }
  }

  // public organelleClick(organelleType: OrganelleType, location: {x: number, y: number}) {
  //   const organism = appStore.getBoxOrganism(this.props.boxId);
  //   if (rootStore.mode === Mode.Assay) {
  //     const organelleInfo = OrganelleRef.create({
  //       organism,
  //       organelleType
  //     });
  //     rootStore.setActiveAssay(organelleInfo);
  //   } else if (rootStore.mode === Mode.Add || rootStore.mode === Mode.Subtract) {
  //     // update substance levels
  //     rootStore.changeSubstanceLevel(OrganelleRef.create({ organism, organelleType }));
  //     // show animation in model
  //     const substanceType = rootStore.activeSubstance;
  //     if (substanceType === SubstanceType.Hormone) {
  //       this.addHormone(organelleType, location);
  //     } else if (substanceType === SubstanceType.SignalProtein) {
  //       this.addSignalProtein(organelleType, location);
  //     }
  //   }
  // }

  public addAgentsOverTime(species: string, state: string, props: object, countAtOnce: number, times: number) {
    const period = SUBSTANCE_ADDITION_MS / times;
    const addAgents = (model: any) => {
      for (let i = 0; i < countAtOnce; i++) {
        const a = model.world.createAgent(this.getModel().world.species[species]);
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

  // public addHormone(organelleType: OrganelleType, location: {x: number, y: number}) {
  //   const inIntercell = organelleType === OrganelleType.Extracellular;
  //   const species = "hexagon";
  //   const state = inIntercell ? "find_path_from_anywhere" : "diffuse";
  //   const props = inIntercell ? location : {speed: 0.4, x: location.x, y: location.y};
  //   const count = inIntercell ? 3 : 2;
  //   this.addAgentsOverTime(species, state, props, count, 9);
  // }

  // public addSignalProtein(organelleType: OrganelleType, location: {x: number, y: number}) {
  //   const inIntercell = organelleType === OrganelleType.Extracellular;
  //   const species = "gProteinPart";
  //   const state = inIntercell ? "find_flowing_path" : "in_cell_from_click";
  //   this.addAgentsOverTime(species, state, location, 1, 9);
  // }

  public isModeDropper(mode: string) {
    // return mode === Mode.Assay || mode === Mode.Add || mode === Mode.Subtract;
    return false;
  }

  public render() {
    const {cellZoom} = this.stores;
    // const hoverLabel = appStore.mysteryLabels ?
    //   mysteryOrganelleNames[this.state.hoveredOrganelle] : this.state.hoveredOrganelle;
    const {hoveredOrganelle} = cellZoom;
    const hoverLabel = hoveredOrganelle ? kOrganelleInfo[hoveredOrganelle].displayName : undefined;
    const hoverDiv = hoverLabel
      ? (
        <div className="hover-location">
          {hoverLabel}
        </div>)
      : null;

    const droppers: any = this.state.dropperCoords.map((dropperCoord: any, i: number) => (
      <div className="temp-dropper" key={i} style={{left: dropperCoord.x - 6, top: dropperCoord.y - 28}}>
        <img src="assets/cell-zoom/dropper.png" width="32px"/>
      </div>
    ));
    // const dropperCursor = this.state.hoveredOrganelle && this.isModeDropper(rootStore.mode);
    const dropperCursor = false;
    const style = {height: MODEL_HEIGHT, width: MODEL_WIDTH};
    return (
      <div className={"model-wrapper" + (dropperCursor ? " dropper" : "")} style={style}>
        <div id={this.props.elementName} className="model" onMouseLeave={this.resetHoveredOrganelle}/>
        {hoverDiv}
        {droppers}
      </div>
    );
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

    model.on("hexagon.notify", () => this.updateReceptorImage());

    model.on("gProtein.notify.break_time", (evt: any) => {
      const proteinToBreak = evt.agent;
      const location = {x: proteinToBreak.getProperty("x"), y: proteinToBreak.getProperty("y")};
      const body = model.world.createAgent(model.world.species.gProteinBody);
      body.setProperties(location);

      const part = model.world.createAgent(model.world.species.gProteinPart);
      part.setProperties(location);

      proteinToBreak.die();

      model.world.setProperty("g_protein_bound", false);

      model.world.createAgent(model.world.species.gProtein);
    });

    model.on("model.step", () => {
      // const organism: IOrganism = appStore.getBoxOrganism(this.props.boxId);
      // let percentLightness = organism.lightness;
      let percentLightness = .2;

      if (percentLightness <= 0.19) {
        percentLightness = 0;
      } else if (percentLightness < 0.39) {
        percentLightness = 0.2;
      } else if (percentLightness < 0.59) {
        percentLightness = 0.4;
      } else if (percentLightness < 0.79) {
        percentLightness = 0.6;
      } else if (percentLightness < 0.99) {
        percentLightness = 0.8;
      } else {
        percentLightness = 1;
      }

      // go from lightest to darkest in HSL space, which provides the best gradual transition

      // lightest brown: rgb(244, 212, 141) : hsl(41°, 82%, 75%)
      // darkest brown:  rgb(124, 81, 21)   : hsl(35°, 71%, 28%)

      const light = [41, 82, 75];
      const dark = [35, 71, 28];
      const color = dark.map( (c, i) => Math.round(c + (light[i] - c) * percentLightness) );
      const colorStr = `hsl(${color[0]},${color[1]}%,${color[2]}%)`;

      const cellFill = model.view.getModelSvgObjectById("cellshape_0_Layer0_0_FILL");
      if (cellFill) {
        cellFill.setColor(colorStr);
      }

      // set lightness on model object so it can change organism image
      // organism.setCellLightness(percentLightness);
    });

    model.on("view.hover.enter", (evt: any) => {
      const {cellZoom} = this.stores;
      const hoveredOrganelle = this.getOrganelleFromMouseEvent(evt);
      if (hoveredOrganelle) {
        cellZoom.setHoveredOrganelle(hoveredOrganelle);
      }
    });

    model.on("view.click", (evt: any) => {
      const clickTarget = this.getOrganelleFromMouseEvent(evt);
      if (clickTarget) {
        // Keep the dropper displayed for substance additions
        // if (rootStore.mode === Mode.Add || rootStore.mode === Mode.Subtract) {
        //   const newCoords = this.state.dropperCoords.slice(0);
        //   newCoords.push({x: evt.e.layerX, y: evt.e.layerY});
        //   this.setState({dropperCoords: newCoords});
        //   rootStore.startTimer(() => {
        //     const splicedCoords = this.state.dropperCoords.slice(0);
        //     splicedCoords.splice(0, 1);
        //     this.setState({dropperCoords: splicedCoords});
        //   },                   SUBSTANCE_ADDITION_MS);
        // }

        // Handle the click in the Organelle model
        const location = model.view.transformToWorldCoordinates({x: evt.e.offsetX, y: evt.e.offsetY});
        // this.organelleClick(clickTarget, location);
      }
    });
  }

  private getOrganelleFromMouseEvent(evt: any): OrganelleType | undefined {
    const {cellZoom} = this.stores;
    const possibleTargets: OrganelleType[] = (Object.keys(this.organelleSelectorInfo) as OrganelleType[])
      .filter(organelle => {
        const organelleInfo = this.organelleSelectorInfo[organelle];
        const visibleModes = organelleInfo.visibleModes;
        return !visibleModes || visibleModes.indexOf(cellZoom.mode) > -1;
      });
    return possibleTargets.find((t) => {
      return evt.target._organelle.matches({selector: this.organelleSelectorInfo[t].selector});
    });
  }

  private resetHoveredOrganelle() {
    this.setState({hoveredOrganelle: null});
  }

  private getOpaqueSelector(organelleType: OrganelleType) {
    return this.organelleSelectorInfo[organelleType].opaqueSelector ?
      this.organelleSelectorInfo[organelleType].opaqueSelector :
      this.organelleSelectorInfo[organelleType].selector;
  }
}

export default OrganelleWrapper;

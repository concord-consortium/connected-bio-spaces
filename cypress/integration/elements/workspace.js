import LeftNav from './elements/LeftNav';
import ViewBox from './elements/InvestigationDialogue';

class Workspace{

    constructor() {
            this.leftNav = new LeftNav();
            this.investigationDialogue = new InvestigateDialogue();
    }
}

export default Workspace;

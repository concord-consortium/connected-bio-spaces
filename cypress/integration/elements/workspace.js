import LeftNav from './elements/LeftNav';
import ViewBox from './elements/InvestigationDialog';

class Workspace{

    constructor() {
            this.leftNav = new LeftNav();
            this.investigationDialog = new InvestigateDialog();
    }
}

export default Workspace;

//
// script.js
//
import { NavigationRail } from './navigation_rail.js';

//
// Class.
//
class Layout {

    //
    // Constructor.
    //
    constructor() {
        this.navigationRail = new NavigationRail();
    }


    //
    // Run.
    //
    Run() {
        this.navigationRail.Run();
    }

}
export { Layout }

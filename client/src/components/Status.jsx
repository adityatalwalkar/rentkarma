import { Link } from "react-router-dom";
import chai from "../banner.png";

import ViewPerson from "./ViewPerson"



const Banner=({statusValue})=>{

    var statusString;
    switch(statusValue) {
        case 0:
          // code block
          statusString = "Draft";
          break;
        case 1:
          // code block
          statusString = "Active"
          break;
        case 3:
            // code block
            statusString = "Terminated. Pending Settlement"
            break;
        case 4:
            // code block
            statusString = "Disputed"
            break;
        case 11:
                // code block
                statusString = "Settled"
                break;
        default:
          statusString ="-";
      }

    return (
        <div>
          {statusString}
        </div>
      );
}
export default Banner;
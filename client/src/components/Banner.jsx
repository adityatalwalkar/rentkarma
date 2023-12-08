import { Link } from "react-router-dom";
import chai from "../banner.png";

import ViewPerson from "./ViewPerson"


const Banner=({state})=>{

    return (
        <div>
          <img src={chai} className="img-fluid" alt=".." width="100%" height="200px"/>
        </div>
      );
}
export default Banner;
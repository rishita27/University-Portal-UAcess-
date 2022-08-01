/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)
*/
import React from "react";

const Heading = (props) => {
  return (
    <>
      <div className="container-fluid" >
        <div className="row" style={{margin:"8px"}}>
          <div className="col">
            <h3 style={{color:props.color}}>{props.name}</h3>
          </div>
        </div>
      </div>
    </>
  );
};
export default Heading;

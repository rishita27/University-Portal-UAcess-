/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)
*/
import React from "react";

const Button = (props) => {
  return (
    <>
      <button {...props}>
        {props.label}
      </button>
    </>
  );
};
export default Button;

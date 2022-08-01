/*
Author:
  - Foram Gaikwad (foram.gaikwad@dal.ca)
*/
import React from "react";

const Input = (props) => {
  return (
    <>
      <div className="form-floating">
        <input
          className="form-control"
          autoComplete="off"
          {...props}
        />
        <label for={props.id}>{props.placeholder}</label>
      </div>
    </>
  );
};
export default Input;

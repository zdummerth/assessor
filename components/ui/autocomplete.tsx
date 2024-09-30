"use client";

import React from "react";

import Select from "react-select";

// create test data
const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default () => (
  <div className="w-full">
    <Select
      defaultValue={[options[2], options[3]]}
      isMulti
      name="colors"
      options={options}
      className="basic-multi-select w-full"
      classNamePrefix="select"
    />
  </div>
);

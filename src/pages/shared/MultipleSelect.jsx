import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

// Fixed Options Select

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};


// start component
const MultipleSelect = ({label ,option, setReturnArray, defaultArray, usage}) => {
  const [defaultOptionIndex, setDefaultOptionIndex] = useState([])
  useEffect(() => {
    option?.map((value, index) => {
      defaultArray?.map(data => {
        if(value.value === data){
          setDefaultOptionIndex(oldIndex => [...oldIndex, option[index]])
        }
      })
    })
  }, [defaultArray])

  const handleChange = (e) => {
    setReturnArray(e)
  }
    return (
      <div className="">
        <div>
          <label className="form-label" htmlFor="animated_1">
            {label}
          </label>
          {
            usage === "add" &&
            option.length > 0 ? 
            <Select
              isClearable={false}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={option}
              styles={styles}
              className="react-select"
              classNamePrefix="select"
              id="mul_2"
              onChange={handleChange}
            /> 
            :""
          }
          {
            usage === "edit" &&
            option.length > 0 && defaultOptionIndex.length > 0 ? 
            <Select
              isClearable={false}
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={defaultOptionIndex}
              isMulti
              options={option}
              styles={styles}
              className="react-select"
              classNamePrefix="select"
              id="animated_1"
              onChange={handleChange}
            /> 
            :""
          }
        </div>
      </div>
    );
  };
  

export default MultipleSelect;
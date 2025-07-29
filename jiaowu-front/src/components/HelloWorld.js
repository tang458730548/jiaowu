import React from 'react';
import { DatePicker } from 'antd';

const HelloWorld = ({ msg }) => {
  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div className="hello">
      <DatePicker onChange={onChange} />
    </div>
  );
};

export default HelloWorld;

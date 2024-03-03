import React, { forwardRef } from 'react';

const TextField: React.forwardRef<HTMLInputElement, { label: string }> =
  forwardRef((props, ref) => {
    return (
      <div
        className={`Polaris-TextField ${props.error && 'Polaris-TextField--error'}`}
      >
        {/* <div className="Polaris-Labelled__LabelWrapper">
          <div className="Polaris-Label">
            <label className="Polaris-Label__Text" htmlFor={props?.label}>
              {props.label}
            </label>
          </div>
        </div> */}
        <input
          className="Polaris-TextField__Input"
          type="text"
          ref={ref}
          id={props.label}
          {...props}
        />
        <div className="Polaris-TextField__Backdrop" />
      </div>
    );
  });

export default TextField;

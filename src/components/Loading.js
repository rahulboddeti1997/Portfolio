import React from "react";
import { Skeleton } from "antd";
import PropTypes from "prop-types";
import BrandedLoader from "./BrandedLoader";
import "./Loading.css";

export default function Loading({ type, minHeight }) {
  const style = minHeight ? { minHeight } : {};
  if (type === "skeleton")
    return (
      <div data-testid="skeleton">
        <Skeleton active />
      </div>
    );
  return (
    <div data-testid="loading" className="loading" style={style}>
      <BrandedLoader 
        size="large"
        type="default"
        message="Loading..."
      />
    </div>
  );
}

Loading.propTypes = {
  type: PropTypes.string,
  minHeight: PropTypes.string,
};

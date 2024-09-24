import React from "react";
import { Skeleton, Spin } from "antd";
import PropTypes from "prop-types";
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
      <Spin tip="Loading..." size="large">
        <div
          style={{
            padding: 50,
            background: "#0000000",
            borderRadius: 4,
          }}
        />
      </Spin>
    </div>
  );
}

Loading.propTypes = {
  type: PropTypes.string,
  minHeight: PropTypes.string,
};

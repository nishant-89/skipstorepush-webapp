import React from "react";
import { Box } from "@mui/material";

import "./shimmerEffect.scss";

interface ShimmerEffectProps {
  tab: number;
}

const ShimmerEffect: React.FC<ShimmerEffectProps> = ({ tab }) => {
  const renderShimmers = () => {
    switch (tab) {
      case 0: // Terms and Conditions
        return (
          <Box className="card border details_wrapper mb-20">
            <div className="shimmer-text long"></div>
            <div className="shimmer-text"></div>
            <div className="shimmer-text short"></div>
          </Box>
        );
      case 1: // Privacy Policy
        return (
          <Box className="card border details_wrapper mb-20">
            <div className="shimmer-text long"></div>
            <div className="shimmer-text"></div>
            <h2 className="shimmer-title"></h2>
            <div className="shimmer-link"></div>
          </Box>
        );
      case 2: // About Us
        return (
          <Box>
            <Box className="card border details_wrapper mb-20">
              <div className="shimmer-text long"></div>
              <div className="shimmer-text short"></div>
            </Box>
            <Box className="card border details_wrapper mb-20">
              <h2 className="shimmer-title"></h2>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="shimmer-link"></div>
              ))}
            </Box>
            <Box className="card border">
              <h2 className="shimmer-title"></h2>
              <Box className="image-preview">
                {[...Array(4)].map((_, i) => (
                  <Box key={i} className="shimmer-img"></Box>
                ))}
              </Box>
            </Box>
          </Box>
        );
      case 3: // FAQ
        return (
          <Box className="fandq">
            {[...Array(2)].map((_, i) => (
              <Box key={i} className="card border mb-20">
                <p className="shimmer-text"></p>
                <p className="shimmer-text"></p>
              </Box>
            ))}
          </Box>
        );
      default:
        return null;
    }
  };

  return <>{renderShimmers()}</>;
};

export default ShimmerEffect;

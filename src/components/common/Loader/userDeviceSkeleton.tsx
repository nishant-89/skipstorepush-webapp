import { Skeleton, Box, Typography } from "@mui/material";
import { v4 as uuid } from "uuid";

import "./userDeviceSkeleton.scss";

interface UserDeviceSkeletonProps {
  count: number; // Number of skeleton rows to display
}

const UserDeviceSkeleton: React.FC<UserDeviceSkeletonProps> = ({ count }) => {
  return (
    <>
      {[...Array(count)].map((_) => (
        <Box key={uuid()} className="deviceList settingDeviceWrapper">
          <Box className="leftWrap">
            <Box className="col">
              <Typography variant="body2" className="lastLogin">
                <Skeleton width={100} />
              </Typography>
              <Typography variant="body1" className="value">
                <Skeleton width={150} />
              </Typography>
            </Box>
            <Box className="deviceDetails">
              <Box className="deviceIcon">
                <Skeleton variant="circular" width={50} height={50} />
              </Box>
              <Box className="details">
                <Skeleton width={120} />
                <Skeleton width={90} />
              </Box>
            </Box>
          </Box>
          <Skeleton
            variant="rectangular"
            width={80}
            height={35}
            className="removeButtonSkeleton"
          />
        </Box>
      ))}
    </>
  );
};

export default UserDeviceSkeleton;

export const setDeviceIdData = (deviceId: string) => {
  localStorage.setItem("deviceId", deviceId);
};

export const getDeviceIdData = () => {
  const deviceId = localStorage.getItem("deviceId");
  if (deviceId) {
    return deviceId;
  } else {
    return "";
  }
};

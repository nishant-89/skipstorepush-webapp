import { Apple } from "lucide-react";
import { AndroidIcon } from "src/utils/common/constants/constants";

export const OsBrandIcon = ({ osType }: { osType?: string }) => {
  const isIos = osType?.toUpperCase() === "IOS";
  const label = isIos ? "iOS" : "Android";

  return (
    <span
      className={`osChip osChip--${isIos ? "ios" : "android"}`}
      aria-label={label}
      title={label}
    >
      {isIos ? (
        <Apple size={16} aria-hidden="true" />
      ) : (
        <img src={AndroidIcon} alt="" width={16} height={16} />
      )}
    </span>
  );
};

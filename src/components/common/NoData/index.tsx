import "src/components/common/NotFound/notFound.scss";
import { AddButtonIcon, notFound } from "src/utils/common/constants";
import ButtonComp from "../Button";

const NoData = ({
  title,
  subtitle,
  buttonLabel,
  buttonAction,
  isDisabled,
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonAction?: () => void;
  isDisabled?: boolean;
}) => {
  return (
    <div className="notFoundwrap">
      <div className="centerWrap">
        <div className="contentWrap">
          <figure className="imageWrapper">
            <img src={notFound} alt="Not Found" />
          </figure>
          <h2 data-testid="no-data">{title ?? "No Data Found"}</h2>
          {subtitle && <p className="subTitle">{subtitle}</p>}
          {buttonLabel && buttonAction && (
            <div className="btnWrap">
              <ButtonComp
                className="userActionBtn"
                variant="contained"
                label={buttonLabel}
                disabled={isDisabled}
                onClick={buttonAction}
                isIcon
                icon={AddButtonIcon}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoData;

import { useState } from "react";
import { Drawer } from "@mui/material";
import { showAlert } from "src/utils/alert";
import ButtonComp from "src/components/common/Button/Button";
import { CopyIcon, DrawerCloseIcon } from "src/utils/common/constants/constants";
import { useReleaseDrawerHelper } from "./helper";
import { FilteredEnvironment } from "../../types";

import "./releaseDrawer.scss";

interface ReleaseDrawerProps {
  open: boolean;
  onClose: () => void;
  envList: FilteredEnvironment[];
}

const maskValue = (value: string, revealed: boolean) => {
  if (!value) {
    return "—";
  }
  if (revealed) {
    return value;
  }
  if (value.length <= 4) {
    return "••••";
  }
  return `${"•".repeat(Math.min(value.length - 4, 24))}${value.slice(-4)}`;
};

const ReleaseDrawer = ({ open, onClose, envList }: ReleaseDrawerProps) => {
  const { handleDrawerClose } = useReleaseDrawerHelper({ onClose });
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  const copyKey = (value: string) => {
    if (!value) {
      return;
    }
    navigator.clipboard.writeText(value);
    showAlert(1, "Key has been copied successfully.");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      className="customDrawerBackdrop"
      slotProps={{
        paper: {
          className: "ReleaseDrawerPaper",
        },
      }}
    >
      <div className="appSheet">
        <header className="appSheetHead">
          <div>
            <p className="appSheetKicker">Environments</p>
            <h2 className="appSheetTitle">Deployment keys</h2>
          </div>
          <button
            className="appSheetClose"
            type="button"
            onClick={handleDrawerClose}
            aria-label="Close Drawer"
          >
            <img src={DrawerCloseIcon} alt="" />
          </button>
        </header>

        <div className="appSheetBody">
          <p className="appSheetLead">
            Each environment has its own CodePush deployment key. Copy Staging
            for internal builds and Production for store binaries.
          </p>

          {envList?.length > 0 ? (
            <ul className="keyList">
              {envList.map((env) => {
                const id = String(env?.value);
                const revealed = Boolean(revealedKeys[id]);
                return (
                  <li className="keyCard" key={id}>
                    <span className="keyLabel">{env?.label}</span>
                    <div className="keyRow">
                      <code>{maskValue(env?.key || "", revealed)}</code>
                      <button
                        type="button"
                        className="textLinkBtn"
                        onClick={() =>
                          setRevealedKeys((prev) => ({
                            ...prev,
                            [id]: !prev[id],
                          }))
                        }
                      >
                        {revealed ? "Hide" : "Show"}
                      </button>
                      <ButtonComp
                        className="copyButton"
                        label=""
                        variant="outlined"
                        isIcon
                        icon={CopyIcon}
                        ariaLabel={`Copy ${env?.name || "deployment"} key`}
                        onClick={() => copyKey(env?.key)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="appSheetEmpty">
              No environments on this app yet. Staging and Production keys
              appear after the app is created.
            </p>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ReleaseDrawer;

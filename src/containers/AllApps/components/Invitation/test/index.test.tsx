import { render } from "@testing-library/react";
import { Invite } from "../index";
import * as reactRouter from "react-router-dom";
import * as inviteHelper from "../helper";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

jest.mock("../helper", () => ({
  useInviteHelper: jest.fn(),
}));

describe("Invite component", () => {
  const mockHandleCheckInvite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (inviteHelper.useInviteHelper as jest.Mock).mockReturnValue({
      handleCheckInvite: mockHandleCheckInvite,
    });
  });

  it("should call handleCheckInvite if id is present", () => {
    (reactRouter.useParams as jest.Mock).mockReturnValue({ id: "123" });

    render(<Invite />);

    expect(mockHandleCheckInvite).toHaveBeenCalledTimes(1);
  });

  it("should NOT call handleCheckInvite if id is not present", () => {
    (reactRouter.useParams as jest.Mock).mockReturnValue({});

    render(<Invite />);

    expect(mockHandleCheckInvite).not.toHaveBeenCalled();
  });
});

import { render } from "@testing-library/react";
import UserDeviceSkeleton from "../userDeviceSkeleton";

describe("UserDeviceSkeleton Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<UserDeviceSkeleton count={2} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

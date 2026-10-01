import { render, screen } from "@testing-library/react";
import UsageCharts from "../UsageCharts";

describe("UsageCharts", () => {
  it("renders iOS/Android rows and weekly release bars", () => {
    render(
      <UsageCharts
        byPlatform={{
          ios: { apps: 2, releases: 3, downloads: 40 },
          android: { apps: 1, releases: 5, downloads: 90 },
        }}
        weeklyReleases={[
          { weekStart: "2026-08-10", label: "Aug 10", count: 1 },
          { weekStart: "2026-08-17", label: "Aug 17", count: 4 },
        ]}
      />
    );

    expect(screen.getByLabelText("Usage charts")).toBeInTheDocument();
    expect(screen.getByText("iOS vs Android")).toBeInTheDocument();
    expect(screen.getByText("2 / 1")).toBeInTheDocument();
    expect(screen.getByText("Releases by week")).toBeInTheDocument();
    expect(screen.getByText("Aug 17")).toBeInTheDocument();
  });

  it("shows an empty weekly state when there is no series", () => {
    render(
      <UsageCharts
        byPlatform={{
          ios: { apps: 0, releases: 0, downloads: 0 },
          android: { apps: 0, releases: 0, downloads: 0 },
        }}
        weeklyReleases={[]}
      />
    );

    expect(
      screen.getByText("No releases in this window.")
    ).toBeInTheDocument();
  });
});

import styles from "../loader.styles";

describe("loader.styles", () => {
  it("should have loaderContainer and loaderImage keys", () => {
    expect(styles).toHaveProperty("loaderContainer");
    expect(styles).toHaveProperty("loaderImage");
  });

  it("should have correct loaderImage styles", () => {
    expect(styles.loaderImage).toEqual({
      width: "300px",
      margin: "0 auto",
    });
  });

  it("loaderContainer zIndex should be a function and background should be correct", () => {
    expect(typeof styles.loaderContainer.zIndex).toBe("function");
    expect(styles.loaderContainer.background).toBe("var(--color-overlay)");
  });

  it("zIndex function should return theme.zIndex.drawer + 1", () => {
    const mockTheme = { zIndex: { drawer: 10 } } as any;
    const zIndexValue = styles.loaderContainer.zIndex(mockTheme);
    expect(zIndexValue).toBe(11);
  });
});

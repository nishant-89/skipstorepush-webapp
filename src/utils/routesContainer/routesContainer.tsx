import { Suspense, ComponentType } from "react";
import PageLoader from "./pageLoader";

// Define Props type
type Props = {
  title?: string;
  // Define additional props here as needed
};

// Define LazyLoader component
const LazyLoader = (Component: ComponentType<Props>) => {
  const WrappedComp = (props: Props) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
  return WrappedComp;
};

export default LazyLoader;

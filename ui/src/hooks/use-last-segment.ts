import { useLocation } from "react-router-dom";

const useLastSegment = () => {
  const path = useLocation().pathname;
  // get latest segment from path
  const lastSegment = path.split('/').pop();
  return lastSegment;
};

export default useLastSegment;

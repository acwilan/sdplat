import { useLocation } from "react-router-dom";

const useFirstPathSegment = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[0] || '';
};

export default useFirstPathSegment;
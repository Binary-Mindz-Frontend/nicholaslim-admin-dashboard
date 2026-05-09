import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTitleFromPath } from "@/utils/getTitleFromPath";

const TitleUpdater: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const label = getTitleFromPath(location.pathname);
    const baseTitle = "Nicholaslim";

    if (label) {
      document.title = `${label}`;
    } else {
      document.title = baseTitle;
    }
  }, [location.pathname]);

  return null;
};

export default TitleUpdater;

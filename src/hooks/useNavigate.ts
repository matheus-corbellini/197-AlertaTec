import { useNavigate as useRRNavigate } from "react-router-dom";
import { routes } from "../routes/paths";

export function useNavigate() {
  const navigate = useRRNavigate();
  return (page: string) => {
    if (page in routes) navigate(routes[page as keyof typeof routes]);
    else navigate(page);
  };
}

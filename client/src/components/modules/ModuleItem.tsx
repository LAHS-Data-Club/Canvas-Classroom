import { NavLink } from "react-router";
import type { ModuleItem } from "../../library/types";

interface Props {
  module: ModuleItem
}

// TODO:
export default function ModuleItem({ module }: Props) {
  return (
    <div className="text-black">
      <div className="rounded gap-4 w-full hover:shadow-md bg-gray-100 hover:bg-gray-200 transition cursor-pointer">
        {(module.type === "Subheader") ? (
          <p className="p-4">
            {module.title}
          </p>
        ) : (module.type === "ExternalUrl") ? (
          <p 
            className="p-4 hover:underline" 
            onClick={() => window.open(module.link, '_blank')}
          >
            {module.title}
          </p>
        ) : (
          <div className="p-4">
            <NavLink to={`/`}>
              {module.title}
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

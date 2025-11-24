import React, { type ReactNode } from "react";

interface ControllerState {
  openSidenav: boolean;
  sidenavColor: string;
  sidenavType: string;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
}

type ControllerAction =
  | { type: "OPEN_SIDENAV"; value: boolean }
  | { type: "SIDENAV_TYPE"; value: string }
  | { type: "SIDENAV_COLOR"; value: string }
  | { type: "TRANSPARENT_NAVBAR"; value: boolean }
  | { type: "FIXED_NAVBAR"; value: boolean }
  | { type: "OPEN_CONFIGURATOR"; value: boolean };

type ControllerContextType = [ControllerState, React.Dispatch<ControllerAction>];

export const MaterialTailwind = React.createContext<ControllerContextType | null>(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(
  state: ControllerState,
  action: ControllerAction
): ControllerState {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      return { ...state, openSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as ControllerAction).type}`);
    }
  }
}

interface MaterialTailwindControllerProviderProps {
  children: ReactNode;
}

export function MaterialTailwindControllerProvider({
  children,
}: MaterialTailwindControllerProviderProps) {
  const initialState: ControllerState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
  };

  const [controller, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [controller, dispatch] as ControllerContextType,
    [controller, dispatch]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController(): ControllerContextType {
  const context = React.useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.tsx";

export const setOpenSidenav = (
  dispatch: React.Dispatch<ControllerAction>,
  value: boolean
) => dispatch({ type: "OPEN_SIDENAV", value });

export const setSidenavType = (
  dispatch: React.Dispatch<ControllerAction>,
  value: string
) => dispatch({ type: "SIDENAV_TYPE", value });

export const setSidenavColor = (
  dispatch: React.Dispatch<ControllerAction>,
  value: string
) => dispatch({ type: "SIDENAV_COLOR", value });

export const setTransparentNavbar = (
  dispatch: React.Dispatch<ControllerAction>,
  value: boolean
) => dispatch({ type: "TRANSPARENT_NAVBAR", value });

export const setFixedNavbar = (
  dispatch: React.Dispatch<ControllerAction>,
  value: boolean
) => dispatch({ type: "FIXED_NAVBAR", value });

export const setOpenConfigurator = (
  dispatch: React.Dispatch<ControllerAction>,
  value: boolean
) => dispatch({ type: "OPEN_CONFIGURATOR", value });


import { setOpenSidenav, useMaterialTailwindController } from "@/context";
import { UserState } from "@/state/UserState";
import { removeTokenFromLocalStorage } from "@/utils/Local-Storage";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Bars3Icon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";
import {
  Avatar,
  Breadcrumbs,
  Button,
  IconButton,
  Input,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Navbar,
  Typography,
} from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import { getMenuForRole } from "@/services/menu.service";

export function DashboardNavbar() {
  const user_state = UserState();
  const user_data = user_state.get();

  // Get menu items based on user role
  const menuItems = getMenuForRole(
    user_data?.user_data?.role as "admin" | "doctor" | "user"
  );

  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <b className="text-[30px] !text-blue-600">
            HealthCare
            <FontAwesomeIcon icon={faLeaf} />
          </b>
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="flex gap-3   items-center justify-center h-full  bg-black py-2 px-4 rounded-full">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex gap-1 px-3 text-sm"
              >
                {item.icon && <item.icon className="h-5 w-5" />}
                <span>{item.label}</span>
              </Link>
            ))}

            <Menu>
              <MenuHandler>
                <IconButton variant="text">
                  <BellIcon className="h-5 w-5 text-white" />
                </IconButton>
              </MenuHandler>
              <MenuList className="w-max border-0">
                <MenuItem className="flex items-center gap-3">
                  <Avatar
                    src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                    alt="item-1"
                    title="User avatar - Laur"
                    size="sm"
                    variant="circular"
                  />
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-normal"
                    >
                      <strong>New message</strong> from Laur
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-1 text-xs font-normal opacity-60"
                    >
                      <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                    </Typography>
                  </div>
                </MenuItem>
                <MenuItem className="flex items-center gap-4">
                  <Avatar
                    src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                    alt="item-1"
                    title="Spotify logo"
                    size="sm"
                    variant="circular"
                  />
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-normal"
                    >
                      <strong>New album</strong> by Travis Scott
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-1 text-xs font-normal opacity-60"
                    >
                      <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                    </Typography>
                  </div>
                </MenuItem>
                <MenuItem className="flex items-center gap-4">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                    <CreditCardIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="mb-1 font-normal"
                    >
                      Payment successfully completed
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center gap-1 text-xs font-normal opacity-60"
                    >
                      <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                    </Typography>
                  </div>
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              className="rounded-full"
              onClick={() => {
                removeTokenFromLocalStorage();
                window.location.reload();
              }}
            >
              LogOut
            </Button>
          </div>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.tsx";

export default DashboardNavbar;

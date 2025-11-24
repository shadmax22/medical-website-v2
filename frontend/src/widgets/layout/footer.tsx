import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

interface FooterProps {
  brandName?: string;
  brandLink?: string;
  routes?: unknown[];
}

export function Footer({
  brandName: _brandName = "Creative Tim",
  brandLink: _brandLink = "https://www.creative-tim.com",
  routes: _routes = [],
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, made with{" "}
          <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" />{" "}
          by{" "}
          <a className="text-blue-600" href="mailto:mdshad7822@gmail.com">
            Shad
          </a>{" "}
          for a better web.
        </Typography>
        <ul className="flex items-center gap-4"></ul>
      </div>
    </footer>
  );
}

Footer.displayName = "/src/widgets/layout/footer.tsx";

export default Footer;

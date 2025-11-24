import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@material-tailwind/react";
import type { modalType } from "node_modules/react-easetools/dist/components/modal/types/modal.type";
// import { title } from "process";
import { Modal } from "react-easetools";

export function VModal(props: modalType & { title?: any }) {
  return Modal({
    ...props,

    props: {
      container: {
        ...props?.props?.container,
        className: `dark:bg-[rgb(31,41,55)] ${
          props?.props?.container?.className ?? ""
        }`,
      },
      body: {
        ...props?.props?.body,
        className: `dark:bg-[rgb(31,41,55)] ${
          props?.props?.body?.className ?? ""
        }`,
      },
      title: {
        ...props?.props?.title,
        className: `dark:bg-[rgb(31,41,55)] ${
          props?.props?.title?.className ?? ""
        }`,
      },
    },
    title: (resolver) => (
      <>
        <div className="flex items-center w-full">
          <b className="uppercase dark:text-gray-400">{props?.title ?? ""}</b>

          <div
            className="ml-auto bg-transparent "
            onClick={() => resolver.close()}
          >
            <FontAwesomeIcon
              className="text-gray-500 text-[18px]"
              icon={faClose}
            ></FontAwesomeIcon>
          </div>
        </div>
      </>
    ),
    footer: props.footer ?? null,
  });
}

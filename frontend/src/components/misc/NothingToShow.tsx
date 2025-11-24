import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function NothingToShow() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <FontAwesomeIcon icon={faLeaf} className="text-[100px] text-gray-500" />
      <h1 className=" font-bold">No data to show</h1>
    </div>
  );
}

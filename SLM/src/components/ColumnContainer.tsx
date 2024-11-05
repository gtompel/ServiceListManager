import { Column } from "../types";
interface Props {
    column: Column;
}
function ColumnContainer(props: Props) {
    const {column} = props;
  return (
    <div className="
    bg-columnBackgroundColor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    ">
        {/* Column Title */}
        <div className="
        bg-mainBackgroundColor
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-columnBackgroundColor
        border-4
        ">
            <div className="
            flex
            gap-2
            ">
        <div className="
        flex
        justify-center
        items-center
        bg-columnBackgroundColor
        px-2
        py-1
        text-sm
        rounded-full
        ">0</div>
        {column.title}
        </div>
        </div>
        {/* Column task container */}
        <div className="flex flex-grow">Content</div>
        {/* Column footer */}
        <div className="flex">Footer</div>
    </div>
  )
}

export default ColumnContainer
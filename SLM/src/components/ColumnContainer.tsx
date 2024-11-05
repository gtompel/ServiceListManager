import { Column, Id } from "../types";
interface Props {
    column: Column;
    deleteColumn: (id: Id) => void;
}
function ColumnContainer(props: Props) {
    const {column, deleteColumn} = props;
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
        flex
        justify-between
        items-center
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
        <button
        onClick={()=>{
          deleteColumn(column.id);
        }}
        className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px-1
        py-2
        ">-</button>
        </div>
        <button className="
        h-[60px]
        w-[350px]
        min-w-[350px]
        cursor-pointer
        rounded-lg
        bg-mainBackgroundColor
        border-2
        border-columnBackgroundColor
        p-4
        ring-rose-500
        hover:ring-2
        flex
        gap-2">+</button>
        {/* Column task container */}
        <div className="flex flex-grow">Content</div>
        {/* Column footer */}
        <div className="flex">Footer</div>
    </div>
  )
}

export default ColumnContainer
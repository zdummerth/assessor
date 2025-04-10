interface StructureListItemProps {
  structure: any;
}

const StructureListItem: React.FC<StructureListItemProps> = ({ structure }) => {
  return (
    <div className="grid grid-cols-3 border border-foreground rounded-md p-2 w-full">
      <div className="justify-self-start">
        <div className="text-xs">Total Area</div>
        <div>{structure.total_area.toLocaleString()} sqft</div>
      </div>
      <div className="justify-self-center text-center">
        <div className="text-xs">GLA</div>
        <div>{structure.gla.toLocaleString()} sqft</div>
      </div>
      <div className="justify-self-end text-right">
        <div className="text-xs">CDU</div>
        <div>{structure.cdu || "NA"}</div>
      </div>
    </div>
  );
};

export default StructureListItem;

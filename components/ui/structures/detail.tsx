interface StructureDetailProps {
  structure: any;
}

const StructureDetail: React.FC<StructureDetailProps> = ({ structure }) => {
  return (
    <div className="flex flex-col gap-4 border border-foreground rounded-lg p-4 w-full">
      {structure.parcel_number && (
        <div className="flex justify-between items-center">
          <div>
            <strong>Parcel Number:</strong>{" "}
            <span>{structure.parcel_number}</span>
          </div>
        </div>
      )}
      <div>
        <strong>Total Area:</strong>{" "}
        <span>{structure.total_area.toLocaleString()} sqft</span>
      </div>
      <div>
        <strong>GLA:</strong> <span>{structure.gla.toLocaleString()} sqft</span>
      </div>
      <div>
        <strong>CDU:</strong> <span>{structure.cdu || "NA"}</span>
      </div>
    </div>
  );
};

export default StructureDetail;

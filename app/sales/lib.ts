export const columnLabels = {
  document_number: "Document Number",
  date_of_sale: "Date of Sale",
  net_selling_price: "Net Selling Price",
  appraiser: "Appraiser",
  parcel: {
    asrparcelid: "Parcel ID",
    asdtotal: "Total Assessed",
    nbrhd: {
      name: "CDA Neighborhood",
      code: "CDA Neighborhood Code",
    },
  },
};

interface LabelObject {
  id: string;
  name: string;
}

function convertToArray(obj: Record<string, any>, prefix = ""): LabelObject[] {
  const result: LabelObject[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const id = prefix ? `${prefix}-${key}` : key;

      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        // Recursively process nested objects
        result.push(...convertToArray(obj[key], id));
      } else {
        result.push({ id, name: obj[key] });
      }
    }
  }

  return result;
}

function convertIdsToNestedString(ids: string[]): string {
  const result: { [key: string]: string[] } = {};

  // Group ids by their prefix (supporting multiple levels of nesting)
  ids.forEach((id) => {
    const parts = id.split("-");
    if (parts.length > 1) {
      const prefix = parts[0];
      const key = parts.slice(1).join("-");
      if (!result[prefix]) {
        result[prefix] = [];
      }
      result[prefix].push(key);
    } else {
      result[id] = [];
    }
  });

  // Build the final string, recursively handling multiple layers
  const resultArray = Object.entries(result).map(([prefix, keys]) => {
    if (keys.length > 0) {
      const nestedString = convertIdsToNestedString(keys); // Recursive call for further nesting
      return `${prefix}(${nestedString})`;
    }
    return prefix;
  });

  return resultArray.join(", ");
}

const resultArray: LabelObject[] = convertToArray(columnLabels);
const ids = resultArray.map((item) => item.id);
const idsString = convertIdsToNestedString(ids);
export const columnIdsString = idsString;
export const columnLabelsArray = resultArray;

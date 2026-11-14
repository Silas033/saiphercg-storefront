// src/data/variantGroups.js
// A product can have several variation sets (for example Size AND Color).
//
// product_variants rows:
//   - group_no 1, 2, ... = the options of each set (group_label = the set's title)
//   - is_combination = true rows are one-per-combination helper rows. Their id is the
//     "whole ID" (set 1 id + the other sets' ids) and their price is the sum, so the order
//     function in Supabase (which looks variants up by id) works for combinations too.

// OTH-HEAVY-P0358FP-v1 + OTH-HEAVY-P0358FP-g2v1  ->  OTH-HEAVY-P0358FP-v1-g2v1
export function combineVariantIds(productId, ids) {
  const [first, ...rest] = ids;
  const prefix = `${productId}-`;
  return [
    first,
    ...rest.map((id) => (id.startsWith(prefix) ? id.slice(prefix.length) : id)),
  ].join("-");
}

export function shapeVariants(rows, fallbackLabel = "Select Variant") {
  const list = rows || [];
  const byNumber = new Map();

  list
    .filter((row) => !row.is_combination)
    .forEach((row) => {
      const no = Number(row.group_no) || 1;
      if (!byNumber.has(no)) byNumber.set(no, []);
      byNumber.get(no).push(row);
    });

  const variantGroups = [...byNumber.keys()]
    .sort((a, b) => a - b)
    .map((no, index) => {
      const options = byNumber
        .get(no)
        .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0));
      return {
        no,
        label:
          options.find((row) => row.group_label)?.group_label ||
          (index === 0 ? fallbackLabel : `Select Option ${index + 1}`),
        variants: options.map((row) => ({
          id: row.id,
          label: row.label,
          price: Number(row.price || 0),
        })),
      };
    });

  const combinations = list
    .filter((row) => row.is_combination)
    .map((row) => ({ id: row.id, label: row.label, price: Number(row.price || 0) }));

  return {
    variantGroups,
    variants: variantGroups[0]?.variants || [], // first set (older code)
    combinations,
  };
}

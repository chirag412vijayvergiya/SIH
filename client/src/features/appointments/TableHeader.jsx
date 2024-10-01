function TableHeader({ heading }) {
  return (
    <th
      scope="col"
      className="px-5 py-3 text-left text-sm font-bold uppercase text-gray-800 dark:text-grey-100"
    >
      {heading}
    </th>
  );
}

export default TableHeader;

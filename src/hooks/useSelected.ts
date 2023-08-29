import { useState } from "react";

function useSelected(defaultValue = "") {
  const [selected, setSelected] = useState(defaultValue);

  const onSelect = (str: string) => setSelected(str);

  return { selected, onSelect };
}

export default useSelected;

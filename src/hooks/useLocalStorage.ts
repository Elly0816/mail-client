import { useState, useEffect } from 'react';

export type localStorageType<T> = [
  T | undefined,
  React.Dispatch<React.SetStateAction<T | undefined>>
];

export interface useLocalStorageProps {
  name: string;
  value?: string;
}

const useLocalStorage = ({
  name,
  value,
}: useLocalStorageProps): localStorageType<string> => {
  const [item, setItem] = useState<string>();

  const [currName, setCurrName] =
    useState<useLocalStorageProps['value']>(value);
  useEffect(() => {
    if (currName) {
      localStorage.setItem(name, currName);
    }
    if (!value) {
      const newItem = localStorage.getItem(name);
      if (newItem) {
        setItem(newItem);
      } else {
        setItem(undefined);
      }
    } else {
      localStorage.setItem(name, currName as string);
      const newItem = localStorage.getItem(name);
      setItem(newItem as string);
    }
  }, [currName, name, value]);

  return [item, setCurrName];
};

export default useLocalStorage;

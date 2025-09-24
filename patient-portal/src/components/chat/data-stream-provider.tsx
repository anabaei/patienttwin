"use client";

import type { DataUIPart } from "ai";
import type React from "react";
import { createContext, useContext, useMemo, useState } from "react";

type CustomUIDataTypes = {
  "data-usage": unknown;
  "data-kind": string;
  "data-id": string;
  "data-title": string;
  "data-clear": null;
  "data-finish": null;
};

type DataStreamContextValue = {
  dataStream: DataUIPart<CustomUIDataTypes>[];
  setDataStream: React.Dispatch<
    React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
  >;
};

const DataStreamContext = createContext<DataStreamContextValue | null>(null);

export function DataStreamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataStream, setDataStream] = useState<DataUIPart<CustomUIDataTypes>[]>(
    []
  );

  const value = useMemo(() => ({ dataStream, setDataStream }), [dataStream]);

  return (
    <DataStreamContext.Provider value={value}>
      {children}
    </DataStreamContext.Provider>
  );
}

export function useDataStream() {
  const context = useContext(DataStreamContext);
  if (!context) {
    throw new Error("useDataStream must be used within a DataStreamProvider");
  }
  return context;
}

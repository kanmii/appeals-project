export interface MappedData {
  name: string;
  gender: string;
  segment: string;
  receivedAssets: boolean;
  improvedTech: boolean;
  receivedTraining: boolean;
  age: number;
}

type KeyOfMappedData = keyof MappedData;
export type ValueOfMappedData = MappedData[KeyOfMappedData];
export type HeaderMapping = { [k: string]: KeyOfMappedData };

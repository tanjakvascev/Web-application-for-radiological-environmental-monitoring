export interface NameHistoryEntry {
  oldValue: string;
  newValue: string;
  changedAt: string | Date;
  changedBy: string;
}

export class Sample{
    internID = ""
    sampleID = ""
    name = ""
    origin = ""
    dateReception = ""
    dateMeasure = ""
    type = ""
    note = ""
    user = ""
    geometry = ""
    detector = ""
    nameHistory: NameHistoryEntry[] = []
}

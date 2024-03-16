export class ColumnNumberTransformer {
  public to(data: number): number {
    return data;
  }

  public from(data: string): string | number {
    if (isNaN(parseInt(data))) {
      return data;
    }

    return parseInt(data);
  }
}

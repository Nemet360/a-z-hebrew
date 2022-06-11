export class Logger {
  private isDebugEnabled = false;

  public constructor(isDebug: boolean) {
    this.isDebugEnabled = isDebug;
  }

  public WriteLog(message: string, isDebug?: boolean | undefined) {
    let shouldWrite = true;
    if (isDebug && !this.isDebugEnabled) {
      shouldWrite = false;
    }
    if (shouldWrite) console.log(message);
  }
}

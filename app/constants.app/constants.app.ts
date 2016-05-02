export class AppConstants {
  private static get DEV_ENDPOINT():string {
    return "http://localhost:9999/api/"
  };

  public static get ENDPOINT():string {
    return AppConstants.DEV_ENDPOINT;
  };
}

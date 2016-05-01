export class AppConstants {
  private static get DEV_ENDPOINT():string {
    return 'http://localhost:9999/api/'
  };

  private static get PROD_ENDPOINT():string {
    return 'http://server.bearbone.com.br:60387/api/'
  };

  public static get ENDPOINT():string {
    return AppConstants.DEV_ENDPOINT;
  };
}

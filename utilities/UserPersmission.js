import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

class UserPermission {
  getCameraPermission = async () => {
    if (Constants.platform.android) {
      //const { status } = await Permissions.askAsync(Permissions.CAMERA);
      alert;

      setPe;
      if (status != "granted") {
      }
    }
  };

  /*
  getCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
  };
  */
}

export default new UserPermission();

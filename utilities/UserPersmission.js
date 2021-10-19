import Cosntants from "expo-constants";
import * as Permissions from "expo-permissions";

class UserPermission {
  getCameraPermission = async () => {
    if (Cosntants.platform.android) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status != "granted") {
      }
    }
  };
}

export default new UserPermission();

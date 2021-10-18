import Cosntants from "expo-constants";
import * as Permissions from "expo-permissions";

class UserPermission {
  getCameraPermission = async () => {
    if (Cosntants.platform.android) {
      const { status } = await Permissions.askAsync(
        Permissions.MEDIA_LIBRARY_WRITE_ONLY
      );

      if (status != "granted") {
        alert("We need permission to use your camera roll");
      }
    }
  };
}

export default new UserPermission();

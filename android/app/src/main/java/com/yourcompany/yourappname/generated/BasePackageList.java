package com.yourcompany.yourappname.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.application.ApplicationPackage(),
        new expo.modules.camera.CameraPackage(),
        new expo.modules.constants.ConstantsPackage(),
        new expo.modules.device.DevicePackage(),
        new expo.modules.documentpicker.DocumentPickerPackage(),
        new expo.modules.errorrecovery.ErrorRecoveryPackage(),
        new expo.modules.filesystem.FileSystemPackage(),
        new expo.modules.font.FontLoaderPackage(),
        new expo.modules.haptics.HapticsPackage(),
        new expo.modules.imageloader.ImageLoaderPackage(),
        new expo.modules.imagemanipulator.ImageManipulatorPackage(),
        new expo.modules.imagepicker.ImagePickerPackage(),
        new expo.modules.keepawake.KeepAwakePackage(),
        new expo.modules.location.LocationPackage(),
        new expo.modules.medialibrary.MediaLibraryPackage(),
        new expo.modules.notifications.NotificationsPackage(),
        new expo.modules.permissions.PermissionsPackage(),
        new expo.modules.sharing.SharingPackage(),
        new expo.modules.splashscreen.SplashScreenPackage(),
        new expo.modules.updates.UpdatesPackage()
    );
  }
}

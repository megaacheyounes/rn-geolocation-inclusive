
package com.megaache.location_demo;

import android.os.Bundle;

import com.huawei.hms.rn.location.backend.helpers.HMSBroadcastReceiver;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    // Returns the name of the main component registered from JavaScript. This is used to schedule
    // rendering of the component.

    @Override
    protected String getMainComponentName() {
        return "example";
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(HMSBroadcastReceiver.getInstance());
    }

}

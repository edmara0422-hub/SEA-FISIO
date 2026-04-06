import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Disable iOS font inflation at native level + inject scoped 10px CSS
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            if let vc = self.window?.rootViewController as? CAPBridgeViewController,
               let webView = vc.webView {

                // 1. Native: allow small fonts, no minimum
                webView.configuration.preferences.minimumFontSize = 0

                // 2. Disable text autosizing via viewport meta + CSS
                let js = """
                (function() {
                    // Ensure viewport prevents zoom (which triggers font inflation)
                    var vp = document.querySelector('meta[name="viewport"]');
                    if (!vp) {
                        vp = document.createElement('meta');
                        vp.name = 'viewport';
                        (document.head || document.documentElement).appendChild(vp);
                    }
                    vp.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';

                    // Force text-size-adjust on everything
                    var base = document.createElement('style');
                    base.id = '__sea_base__';
                    base.textContent = [
                        '* { -webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important; }',
                        'input, select, textarea { font-size: 10px !important; -webkit-text-size-adjust: 100% !important; }'
                    ].join('\\n');
                    (document.head || document.documentElement).appendChild(base);
                })();
                """
                let script = WKUserScript(source: js, injectionTime: .atDocumentStart, forMainFrameOnly: false)
                webView.configuration.userContentController.addUserScript(script)
                webView.evaluateJavaScript(js, completionHandler: nil)
            }
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {}
    func applicationDidEnterBackground(_ application: UIApplication) {}
    func applicationWillEnterForeground(_ application: UIApplication) {}
    func applicationDidBecomeActive(_ application: UIApplication) {}
    func applicationWillTerminate(_ application: UIApplication) {}

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }
}

import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Disable iOS text-size-adjust so 10px fonts render correctly
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            if let vc = self.window?.rootViewController as? CAPBridgeViewController,
               let webView = vc.webView {
                let js = """
                (function() {
                    var s = document.createElement('style');
                    s.textContent = 'html, body, * { -webkit-text-size-adjust: none !important; text-size-adjust: none !important; }';
                    document.documentElement.appendChild(s);
                })();
                """
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

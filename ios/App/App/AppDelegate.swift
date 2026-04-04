import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Inject CSS before page loads to prevent iOS font inflation
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            if let vc = self.window?.rootViewController as? CAPBridgeViewController,
               let webView = vc.webView {
                let css = """
                html, body, * { -webkit-text-size-adjust: none !important; text-size-adjust: none !important; }
                input, select, textarea { font-size: 10px !important; }
                """
                let js = """
                (function() {
                    var s = document.createElement('style');
                    s.textContent = `\(css)`;
                    document.documentElement.appendChild(s);

                    // Also set on all existing inputs
                    document.querySelectorAll('input, select, textarea').forEach(function(el) {
                        el.style.fontSize = '10px';
                    });

                    // Observer for new inputs
                    var obs = new MutationObserver(function(muts) {
                        muts.forEach(function(m) {
                            m.addedNodes.forEach(function(n) {
                                if (n.nodeType === 1) {
                                    if (n.tagName === 'INPUT' || n.tagName === 'SELECT' || n.tagName === 'TEXTAREA') {
                                        n.style.fontSize = '10px';
                                    }
                                    n.querySelectorAll && n.querySelectorAll('input, select, textarea').forEach(function(el) {
                                        el.style.fontSize = '10px';
                                    });
                                }
                            });
                        });
                    });
                    obs.observe(document.body, { childList: true, subtree: true });
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

import UIKit
import Capacitor
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Inject CSS BEFORE page loads via WKUserScript
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            if let vc = self.window?.rootViewController as? CAPBridgeViewController,
               let webView = vc.webView {
                let js = """
                (function() {
                    function injectStyle() {
                        if (document.getElementById('__sea_base_style__')) return;
                        var base = document.createElement('style');
                        base.id = '__sea_base_style__';
                        base.textContent = 'html, body, * { -webkit-text-size-adjust: none !important; text-size-adjust: none !important; }';
                        (document.head || document.documentElement).appendChild(base);

                        var s1 = document.createElement('style');
                        s1.id = '__sea_s1_font__';
                        s1.textContent = 'input, select, textarea { font-size: 10px !important; }';
                        s1.disabled = true;
                        (document.head || document.documentElement).appendChild(s1);
                    }
                    injectStyle();

                    function isS1Page() {
                        var url = window.location.href.toLowerCase();
                        return url.indexOf('sistemas') !== -1 || url.indexOf('prontuario') !== -1;
                    }
                    function applyScopedFont() {
                        injectStyle();
                        var s1 = document.getElementById('__sea_s1_font__');
                        if (s1) s1.disabled = !isS1Page();
                    }
                    applyScopedFont();

                    var lastUrl = window.location.href;
                    setInterval(function() {
                        if (window.location.href !== lastUrl) {
                            lastUrl = window.location.href;
                            applyScopedFont();
                        }
                    }, 250);

                    document.addEventListener('DOMContentLoaded', applyScopedFont);
                    window.addEventListener('load', applyScopedFont);
                })();
                """
                let script = WKUserScript(source: js, injectionTime: .atDocumentStart, forMainFrameOnly: false)
                webView.configuration.userContentController.addUserScript(script)

                // Also apply immediately for current page
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

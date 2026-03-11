/* React 19: ampliação do @react-three/fiber não mescla com React.JSX.
   Declaramos os elementos Three.js em React.JSX.IntrinsicElements. */
import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      color: any;
      fog: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

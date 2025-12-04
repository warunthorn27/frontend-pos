declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.svg?react" {
  import * as React from "react";
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}


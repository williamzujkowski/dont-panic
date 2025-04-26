export interface FeatureItem {
  title: string;
  description: string;
  icon?: string; // Optional icon class or path
}

export const featuresData: FeatureItem[] = [
  {
    title: "Fast by Default",
    description: "Astro renders your UI to HTML at build time. No JavaScript runtime.",
    icon: "🚀" // Example using emoji as icon
  },
  {
    title: "Component Islands",
    description: "Need interactive UI? Load individual components on demand.",
    icon: "🏝️"
  },
  {
    title: "Framework Agnostic",
    description: "Use your favorite UI components from React, Preact, Svelte, Vue, Solid, Lit and more.",
    icon: "⚙️"
  }
];

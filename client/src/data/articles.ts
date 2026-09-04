export type ArticleSource = {
  label: string;
  url: string;
  note: string;
};

export type Article = {
  slug: string;
  title: string;
  eyebrow: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  tone: "night" | "paper" | "blue";
  keyQuestion: string;
  sources: ArticleSource[];
  sections: Array<{
    label: string;
    heading: string;
    paragraphs: string[];
    pullQuote?: string;
  }>;
};

import content from "./articles.json";

const typedContent = content as unknown as { categories: string[]; articles: Article[] };
export const articles = typedContent.articles;
export const categories = typedContent.categories;

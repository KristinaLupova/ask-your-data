export interface SampleDataset {
  id: string;
  label: string;
  description: string;
  url: string;
  questions: string[];
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: "ecommerce",
    label: "E-commerce orders",
    description: "12 months of orders across 8 countries",
    url: "/samples/ecommerce-orders.csv",
    questions: [
      "Which country had the biggest revenue drop last quarter?",
      "What is the refund rate by payment method?",
      "Show monthly revenue by category.",
    ],
  },
  {
    id: "saas",
    label: "SaaS subscriptions",
    description: "12 months of invoices for 240 customers",
    url: "/samples/saas-subscriptions.csv",
    questions: [
      "How did MRR change month by month?",
      "Which payment method has the most failed invoices?",
      "What share of revenue comes from each plan?",
    ],
  },
];

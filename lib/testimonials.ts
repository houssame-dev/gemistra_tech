export type Testimonial = {
  id: string;
  messageKey: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  image?: string;
};

// PLACEHOLDER: replace this entry with the six approved client testimonials.
// Add one structural entry here and one matching block in every message file.
export const testimonials: Testimonial[] = [
  {
    id: "placeholder-client",
    messageKey: "placeholder-client",
  },
];

export interface Metadata {
  genres: Array<{ id: string; name: string }>;
  conditions: Array<{ id: string; name: string }>;
  variants: Array<{ id: string; name: string }>;
  formats: Array<{ id: string; name: string }>;
  styles: Array<{ id: string; name: string }>;
}

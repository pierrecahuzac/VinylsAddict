export interface Metadata {
  genres: Array<{ id: number; name: string }>;
  conditions: Array<{ id: number; name: string }>;
  variants: Array<{ id: number; name: string }>;
  formats: Array<{ id: number; name: string }>;
  styles: Array<{ id: number; name: string }>;
}

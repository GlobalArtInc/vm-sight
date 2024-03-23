export type Endpoint = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  publicUrl: string;
  connectionInfo: Record<string, unknown>;
  serviceInfo: unknown;
}
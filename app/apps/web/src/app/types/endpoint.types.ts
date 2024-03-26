export type Endpoint = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  publicUrl: string;
  isActive: boolean;
  connectionInfo?: any;
  serviceInfo?: any;

}
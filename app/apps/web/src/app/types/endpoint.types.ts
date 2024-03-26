export type Endpoint = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  publicUrl: string;
  isActive: boolean;
  connectionInfo?: any;
  serviceInfo?: any;
}

export type Container = {
  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
}

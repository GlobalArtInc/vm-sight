import { AuthState } from '@sight-types/interfaces/auth';

// Store root state
export interface RootState {
  topToolbar: TopToolbarState;
  auth: AuthState;
}

// Store modules state
export interface TopToolbarState {
  title: string;
}

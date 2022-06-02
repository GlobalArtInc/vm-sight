import { AuthState } from '@/interfaces/auth.interface';

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  dateString: string;
  baseImageName: string;
  articleType: ArticleType;
  isFavourite: boolean;
}

export enum ArticleType {
  TopStory = 'TOP_STORY',
  CodeExample = 'CODE_EXAMPLE'
}

// Store root state
export interface RootState {
  topToolbar: TopToolbarState;
  auth: AuthState;
}

// Store modules state
export interface TopToolbarState {
  title: string;
}

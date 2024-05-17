export interface NewComponentGeneratorSchema {
  name: string;
	project: string;
	storybook: boolean;
	asyncStory?: boolean;
	test: boolean;
	language?: string;
}

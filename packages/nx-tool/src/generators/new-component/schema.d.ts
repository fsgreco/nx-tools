export interface NewComponentGeneratorSchema {
  name: string;
	project: string;
	storybook?: boolean;
	asyncStory?: boolean;
	test: boolean;
	language?: string;
	directory?: string;
	styles: 'css'|'styled-components'|'none';
}

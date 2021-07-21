import {
  Theme,
  CursorShape,
  RenderPageOptions as PlaygroundRenderPageOptions,
} from 'graphql-playground-html/dist/render-playground-page';

// This specifies the React version of our fork of GraphQL Playground,
// `@apollographql/graphql-playground-react`. It is related to, but not to
// be confused with, the `@apollographql/graphql-playground-html` package which
// is a dependency of Apollo Server's various integration `package.json`s files.
//
// The HTML (stub) file renders a `<script>` tag that loads the React (guts)
// from a CDN URL on jsdelivr.com, which allows serving of files from npm packages.
//
// The version is passed to `@apollographql/graphql-playground-html`'s
// `renderPlaygroundPage` via the integration packages' `playground` config.
const playgroundVersion = '1.7.39';

// https://stackoverflow.com/a/51365037
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends (Record<string, unknown> | undefined)
    ? RecursivePartial<T[P]>
    : T[P];
};

export type PlaygroundConfig =
  | RecursivePartial<PlaygroundRenderPageOptions>
  | boolean;

export const defaultPlaygroundOptions = {
  version: playgroundVersion,
  settings: {
    'editor.fontSize': 14,
    'editor.reuseHeaders': true,
    'general.betaUpdates': false,
    'schema.polling.interval': 5,
    'schema.polling.enable': true,
    'request.credentials': 'omit',
    'editor.theme': 'dark' as Theme,
    'tracing.tracingSupported': true,
    'tracing.hideTracingResponse': true,
    'queryPlan.hideQueryPlanResponse': true,
    'editor.cursorShape': 'line' as CursorShape,
    'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
  },
};

export interface ISettings {
    'request.globalHeaders': {
        [key: string]: string;
    };
}

export function createPlaygroundOptions(
  playground?: PlaygroundRenderPageOptions | boolean,
): PlaygroundRenderPageOptions | undefined {
  const isDev = process.env.NODE_ENV !== 'production';
  const enabled: boolean = typeof playground !== 'undefined' ? !!playground : isDev;

  if (!enabled) {
    return undefined;
  }

  const playgroundOverrides = typeof playground === 'boolean' ? {} : playground || {};
  const hasSettings = Object.prototype.hasOwnProperty.call(playgroundOverrides, 'settings');

  const settingsOverrides = hasSettings ? {
      settings: {
        ...defaultPlaygroundOptions.settings,
        ...playgroundOverrides.settings,
      },
    }
  : { settings: undefined };

  const playgroundOptions = {
    ...defaultPlaygroundOptions,
    ...playgroundOverrides,
    ...settingsOverrides,
  };

  return playgroundOptions as unknown as PlaygroundRenderPageOptions;
}

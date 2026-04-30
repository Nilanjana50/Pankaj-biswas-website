export const WP_API_BASE =
  process.env.REACT_APP_WP_API_BASE ||
  (process.env.NODE_ENV === 'development' ? '/wp-json' : 'https://pankajbiswas.com/wp-json');

export const wpApi = (path) => {
  if (typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${WP_API_BASE}${normalizedPath}`;
};

export const fetchWp = (path, options) => fetch(wpApi(path), options);

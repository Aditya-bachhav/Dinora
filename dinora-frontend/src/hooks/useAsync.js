import { useEffect, useState } from 'react';

export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ loading: true, error: '', data: null });
  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: '', data: null });
    fn()
      .then((data) => alive && setState({ loading: false, error: '', data }))
      .catch((error) => alive && setState({ loading: false, error: error.message || 'Request failed', data: null }));
    return () => { alive = false; };
  }, deps);
  return state;
}

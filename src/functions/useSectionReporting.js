import { useCallback } from 'react';

export default function useSectionReporting(id, handleViewport) {
  const onEnter = useCallback(() => {
    handleViewport(id, true);
  }, [id, handleViewport]);

  const onLeave = useCallback(() => {
    handleViewport(id, false);
  }, [id, handleViewport]);

  return { onEnter, onLeave };
}
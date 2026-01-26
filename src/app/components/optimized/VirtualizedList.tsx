import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

/**
 * Virtualized list component for rendering large lists efficiently
 * Only renders items currently visible in viewport + overscan buffer
 */
export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className = '',
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Calculate which items to render
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;
  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto ${className}`}
      style={{ height }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Simple virtualized grid for 2-column layouts
 */
interface VirtualizedGridProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  columns?: number;
  gap?: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualizedGrid<T>({
  items,
  height,
  itemHeight,
  columns = 2,
  gap = 16,
  renderItem,
  overscan = 2,
  className = '',
}: VirtualizedGridProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Calculate rows
  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columns);
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + height) / rowHeight) + overscan
  );

  const startIndex = startRow * columns;
  const endIndex = Math.min(items.length - 1, (endRow + 1) * columns - 1);

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startRow * rowHeight;
  const totalHeight = totalRows * rowHeight;

  // Group items into rows
  const rows: T[][] = [];
  for (let i = 0; i < visibleItems.length; i += columns) {
    rows.push(visibleItems.slice(i, i + columns));
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto ${className}`}
      style={{ height }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {rows.map((row, rowIndex) => (
            <div
              key={startRow + rowIndex}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `${gap}px`,
                marginBottom: `${gap}px`,
              }}
            >
              {row.map((item, colIndex) => {
                const itemIndex = startIndex + rowIndex * columns + colIndex;
                return (
                  <div key={itemIndex}>
                    {renderItem(item, itemIndex)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

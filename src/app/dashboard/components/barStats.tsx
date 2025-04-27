'use client';
import React, { useState, useRef } from 'react';
import { useRecords } from '@/app/contexts/RecordsContext';
import BarStatsInner from '@/app/stats/components/BarStats';

const BarStats: React.FC<{ editMode?: boolean; onClose: () => void }> = ({
  editMode = false,
  onClose
}) => {

  const { records } = useRecords();

  const [pos, setPos] = useState({ x: -390, y: 570 });
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editMode || !boxRef.current || !(e.target as HTMLElement).dataset.drag) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const { x: initX, y: initY } = pos;

    const move = (mv: MouseEvent) =>
      setPos({ x: initX + mv.clientX - startX, y: initY + mv.clientY - startY });

    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div
      ref={boxRef}
      data-drag="true"
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        top: pos.y,
        left: pos.x,
        width: 600,
        height: 500,
        background: '#fff',
        borderRadius: 10,
        padding: 20,
        boxShadow: '0 0 10px rgba(0,0,0,0.15)',
        cursor: editMode ? 'move' : 'default',
        overflow: 'hidden',
        zIndex: 1050
      }}
    >
      {editMode && (
        <button
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: 24,
            height: 24,
            border: 'none',
            borderRadius: '50%',
            background: '#d32f2f',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 700
          }}
        >
          ×
        </button>
      )}

      <BarStatsInner records={records} />
    </div>
  );
};

export default BarStats;
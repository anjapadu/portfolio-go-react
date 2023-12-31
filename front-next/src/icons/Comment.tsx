import * as React from 'react'
import { SVGProps } from 'react'
const CommentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={props.width || 50} height={props.height || 49.32} viewBox="0 0 50 49.32" {...props}>
    <defs>
      <style>{'.cls-1{fill:#111}'}</style>
    </defs>
    <title>{'Comment'}</title>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Comment">
        <path
          d="M41.83 0H8.17A8.17 8.17 0 0 0 0 8.17v21.66A8.17 8.17 0 0 0 8.17 38h2.55l-3.38 8A2.5 2.5 0 1 0 12 47.68l4.76-11.17a.64.64 0 0 1 0-.07v-.07l.05-.17c0-.08.05-.17.07-.26a2.45 2.45 0 0 0 0-.27 1 1 0 0 0 0-.17 2.46 2.46 0 0 0 0-.28V35a2.09 2.09 0 0 0-.08-.23.9.9 0 0 0-.08-.23 1.28 1.28 0 0 0-.11-.2 1.55 1.55 0 0 0-.12-.22l-.16-.19a1.22 1.22 0 0 0-.15-.17 1.39 1.39 0 0 0-.19-.15.9.9 0 0 0-.19-.15l-.19-.11a2.06 2.06 0 0 0-.26-.12h-.17l-.24-.23H8.17A3.17 3.17 0 0 1 5 29.83V8.17A3.17 3.17 0 0 1 8.17 5h33.66A3.17 3.17 0 0 1 45 8.17v21.66A3.17 3.17 0 0 1 41.83 33H24.5a2.5 2.5 0 0 0 0 5h17.33A8.17 8.17 0 0 0 50 29.83V8.17A8.17 8.17 0 0 0 41.83 0z"
          className="cls-1"
        />
        <path d="M33 14.5a2.5 2.5 0 0 0-2.5-2.5h-18a2.5 2.5 0 0 0 0 5h18a2.5 2.5 0 0 0 2.5-2.5z" className="cls-1" />
        <rect
          width={18}
          height={5}
          x={10}
          y={21}
          rx={2.5}
          ry={2.5}
          style={{
            fill: '#00c569',
          }}
        />
      </g>
    </g>
  </svg>
)
export default CommentIcon

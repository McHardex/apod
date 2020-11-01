import { memo, useEffect, useRef, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  id: string;
  children: ReactNode;
};

const Portal: React.FC<Props> = ({ id, children }) => {
  const el = useRef(document.getElementById(id) || document.createElement('div'));

  const [dynamic] = useState(!el.current.parentElement);
  useEffect(() => {
    if (dynamic) {
      el.current.id = id;
      document.body.appendChild(el.current);
    }
  }, []);
  return id ? createPortal(children, el.current) : null;
};

export default memo(Portal);

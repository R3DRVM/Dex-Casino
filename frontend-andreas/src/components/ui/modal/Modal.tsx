import { useClickOutside } from '../../../hooks/useClickOutside';
import { ReactElement, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';

import './Modal.scss';

type Props = {
  children: ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  className?: string;
};

export const Modal = ({ children, visible, setVisible, className }: Props): ReactElement | null => {
  const modalref = useRef(null);
  useClickOutside(modalref, () => setVisible(false));
  // const theme = useSelector(state => state.auth.user?.theme);
  // const themeClass = theme || 'dark';
  const classes = ['modal2 app', className].join(' ');

  if (!visible) return null;

  return (
    visible && (
      <>
        {createPortal(
          <div className='backdrop'></div>,
          document.getElementById('backdrop-root') as HTMLInputElement
        )}
        {createPortal(
          <section
            ref={modalref}
            // className={themeClass}
          >
            <div className={classes}>{children}</div>
          </section>,
          document.getElementById('overlay-root') as HTMLInputElement
        )}
      </>
    )
  );
};

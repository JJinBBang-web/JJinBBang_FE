// src/components/common/Portal.tsx
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

export default Portal;

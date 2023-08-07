import { Button } from 'antd';
import { drawerContext, drawerPropsType } from '../../contexts/contexts';
import { useContext } from 'react';

interface DrawerButtonProps {
  message: string;
}

const ToggleDrawerButton: React.FC<DrawerButtonProps> = ({ message }) => {
  const { isOpen, setIsOpen } = useContext(drawerContext) as drawerPropsType;

  return (
    <Button
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      {message}
    </Button>
  );
};

export default ToggleDrawerButton;

import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { NotificationProvider } from '@/components/common/NotificationSystem';

function App() {
  return (
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  );
}

export default App;

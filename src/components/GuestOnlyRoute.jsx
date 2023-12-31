import useStorage from '@/hooks/useStorage';
import { element } from 'prop-types';
import { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function GuestOnlyRoutes({ children }) {
  const navigate = useNavigate();
  const { storageData } = useStorage('pocketbase_auth');
  const isAuthenticated = storageData?.token;
  const { pathname, search, hash } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const wishLocationPath = `${pathname}${search}${hash}`;

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      import.meta.env.MODE === 'development' && toast.dismiss();

      toast('로그인 / 회원가입 페이지입니다', {
        position: 'top-center',
        icon: '🚨',
        ariaProps: {
          role: 'alert',
          'aria-live': 'polite',
        },
      });

      return navigate('/', { state: { wishLocationPath } });
    }

    const cleanup = setTimeout(() => setIsLoading(false));

    return () => {
      clearTimeout(cleanup);
    };
  }, [isAuthenticated, isLoading, navigate, wishLocationPath]);

  return children;
}

GuestOnlyRoutes.propTypes = {
  children: element,
};

export default GuestOnlyRoutes;

/** @format */

import { useQuery } from '@tanstack/react-query';
import { FC, PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Protect: FC<PropsWithChildren> = ({ children }) => {
	const {
		data: user,
		isPending: loadingAuthStatus,
		isError,
	} = useQuery({
		queryKey: ['user'],
	});

	const navigate = useNavigate();

	useEffect(() => {
		if ((!loadingAuthStatus && !user) || isError) {
			toast.error('You need to be logged in to access this page', {
				richColors: true,
			});
			navigate('/');
		}
	}, [navigate, user, loadingAuthStatus, isError]);
	return <>{children}</>;
};

export default Protect;

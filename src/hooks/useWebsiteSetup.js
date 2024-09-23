'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchWebsiteSetup } from '@/store/store';

export function useWebsiteSetup() {
  const dispatch = useDispatch();
  const websiteSetup = useSelector((state) => state.websiteSetup);

  useEffect(() => {
    if (!websiteSetup.data && !websiteSetup.isLoading && !websiteSetup.error) {
      dispatch(fetchWebsiteSetup());
    }
  }, [dispatch, websiteSetup]);

  return websiteSetup;}
import { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';

export type AppDispatch = Dispatch<Action> &
  ThunkDispatch<RootState, null, Action>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

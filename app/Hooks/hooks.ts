import { TypedUseSelectorHook, useSelector as rawUseSelector } from 'react-redux';
import {RootState} from "@/app/Types/types";

export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;

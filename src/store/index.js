import {configureStore} from '@reduxjs/toolkit';

import { backendApi } from './backend/back.api';
import { setupListeners } from '@reduxjs/toolkit/dist/query';




export const store = configureStore({
    reducer: {
        [backendApi.reducerPath]: backendApi.reducer
    },
    middleware: (gDM) => gDM().concat(backendApi.middleware),
})

setupListeners(store.dispatch)
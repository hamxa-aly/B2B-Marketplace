import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './RootReducer';

const store = configureStore({
  reducer: rootReducer, // Just use rootReducer directly without redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Keeps the default behavior
    }),
});

export { store };

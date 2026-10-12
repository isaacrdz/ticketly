import { router } from 'expo-router';

/** Goes back, or to the Expenses tab when there is no history (for example after a deep link). */
export function goBackOrHome() {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace('/');
}
